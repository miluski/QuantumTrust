package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.DepositMapper;
import com.quantum.trust.backend.model.TransactionCredentials;
import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.DepositRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
@EnableScheduling
public class DepositService {
    private final AccountService accountService;
    private final CryptoService cryptoService;
    private final DepositMapper depositMapper;
    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;
    private final DepositRepository depositRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public DepositService(AccountService accountService, CryptoService cryptoService, DepositMapper depositMapper,
            ObjectMapper objectMapper,
            DepositRepository depositRepository, AccountRepository accountRepository,
            TransactionService transactionService) {
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.depositMapper = depositMapper;
        this.objectMapper = objectMapper;
        this.depositRepository = depositRepository;
        this.accountRepository = accountRepository;
        this.transactionService = transactionService;
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkDeposits() {
        try {
            List<Deposit> deposits = depositRepository.findAll();
            if (deposits.size() >= 1) {
                LocalDate today = LocalDate.now();
                for (Deposit deposit : deposits) {
                    LocalDate endDate = LocalDate.parse(deposit.getEndDate());
                    if (endDate.isBefore(today) || endDate.isEqual(today)) {
                        this.closeDeposit(deposit);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<?> saveNewDeposit(HttpServletRequest httpServletRequest, String encryptedDepositDto) {
        try {
            Deposit deposit = this.getDepositFromEncryptedDto(encryptedDepositDto);
            if (deposit == null) {
                throw new Exception("Deposit is null");
            }
            this.depositRepository.save(deposit);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getAllUserDeposits(HttpServletRequest httpServletRequest) {
        try {
            List<Account> accountsList = this.accountService.retrieveAccountsFromUserId(httpServletRequest);
            return accountsList.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                    : this.getResponse(accountsList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private void closeDeposit(Deposit deposit) throws Exception {
        Account account = deposit.getAccount();
        Float interest = this.calculateInterest(deposit);
        Float finalDepositBalance = interest + deposit.getBalance();
        account.setBalance(account.getBalance() + finalDepositBalance);
        this.saveClosingDepositTransaction(account, deposit, finalDepositBalance);
        accountRepository.save(account);
        depositRepository.delete(deposit);
    }

    private float calculateInterest(Deposit deposit) {
        float initialCapital = deposit.getBalance();
        float percent = deposit.getPercent();
        int monthsCount = deposit.getDuration();
        String depositType = deposit.getType();
        float profit = depositType.equals("progressive")
                ? Math.round(((initialCapital * percent) / 100) * (monthsCount / 12.0f))
                : this.getNonProgressiveDepositProfit(percent, monthsCount, initialCapital);
        return Math.round(profit * 0.83f);
    }

    private float getNonProgressiveDepositProfit(float percent, float monthsCount, float initialCapital) {
        float rate = percent;
        float totalProfit = 0;
        for (int i = 1; i <= monthsCount; i++) {
            if (i > 3) {
                rate += 1;
            }
            totalProfit += (initialCapital * rate) / 100 / 12;
        }
        return Math.round(totalProfit);
    }

    private void saveClosingDepositTransaction(Account account, Deposit deposit, Float finalDepositBalance) {
        String title = "Zamknięcie lokaty " + deposit.getId();
        TransactionCredentials transactionCredentials = new TransactionCredentials(account.getBalance(),
                finalDepositBalance, "Inne", "settled", title, "incoming");
        TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
        this.transactionService.saveNewTransaction(transactionDto);
    }

    private Deposit getDepositFromEncryptedDto(String encryptedDepositDto) throws Exception {
        String decryptedDepositDto = this.cryptoService.decryptData(encryptedDepositDto);
        decryptedDepositDto = decryptedDepositDto.replace("\\", "\"");
        DepositDto depositDto = objectMapper.readValue(decryptedDepositDto, DepositDto.class);
        Deposit deposit = this.depositMapper.convertToDeposit(depositDto);
        this.assignAccountToDeposit(deposit, depositDto);
        return deposit;
    }

    private void assignAccountToDeposit(Deposit deposit, DepositDto depositDto) throws Exception {
        Optional<Account> account = this.accountRepository.findById(depositDto.getAssignedAccountNumber());
        if (account.isEmpty()) {
            throw new Exception("Account not founded");
        }
        this.updateAccountBalance(deposit, account.get());
        deposit.setAccount(account.get());
    }

    private void updateAccountBalance(Deposit deposit, Account account) throws Exception {
        Float accountBalance = account.getBalance();
        Float depositBalance = deposit.getBalance();
        Float newAccountBalance = accountBalance - depositBalance;
        account.setBalance(newAccountBalance);
        this.accountRepository.save(account);
        this.saveNewTransaction(account, depositBalance);
    }

    private void saveNewTransaction(Account account, Float depositBalance) throws Exception {
        TransactionCredentials transactionCredentials = new TransactionCredentials(account.getBalance(), depositBalance,
                "Inne", "settled", "Założenie nowej lokaty.", "outgoing");
        TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
        this.transactionService.saveNewTransaction(transactionDto);
    }

    private ResponseEntity<?> getResponse(List<Account> accountsList) throws Exception {
        List<DepositDto> depositsList = new ArrayList<>();
        this.addAllDeposits(accountsList, depositsList);
        String encryptedDepositsList = this.cryptoService.encryptData(depositsList);
        EncryptedDto encryptedDto = new EncryptedDto(encryptedDepositsList);
        return depositsList.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
    }

    private void addAllDeposits(List<Account> accountsList, List<DepositDto> depositsList) {
        for (Account account : accountsList) {
            List<Deposit> depositsAssignedToAccount = this.depositRepository
                    .findAllDepositsByAccount(account);
            if (!depositsAssignedToAccount.isEmpty()) {
                for (Deposit deposit : depositsAssignedToAccount) {
                    depositsList.add(this.depositMapper.convertToDepositDto(deposit));
                }
            }
        }
    }
}
