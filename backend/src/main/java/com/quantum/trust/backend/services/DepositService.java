package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.DepositMapper;
import com.quantum.trust.backend.mappers.TransactionMapper;
import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.model.entities.Transaction;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.DepositRepository;
import com.quantum.trust.backend.repositories.TransactionRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class DepositService {
    private final AccountService accountService;
    private final CryptoService cryptoService;
    private final DepositMapper depositMapper;
    private final ObjectMapper objectMapper;
    private final TransactionMapper transactionMapper;
    private final DepositRepository depositRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public DepositService(AccountService accountService, CryptoService cryptoService, DepositMapper depositMapper,
            ObjectMapper objectMapper, TransactionMapper transactionMapper,
            DepositRepository depositRepository, AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.depositMapper = depositMapper;
        this.objectMapper = objectMapper;
        this.transactionMapper = transactionMapper;
        this.depositRepository = depositRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void checkDeposits() {
        List<Deposit> deposits = depositRepository.findAll();
        if (deposits.size() >= 1) {
            LocalDate today = LocalDate.now();
            for (Deposit deposit : deposits) {
                LocalDate endDate = LocalDate.parse(deposit.getEndDate());
                if (endDate.isBefore(today) || endDate.isEqual(today)) {
                    Account account = deposit.getAccount();
                    float interest = deposit.getDuration() * deposit.getPercent() * deposit.getBalance();
                    account.setBalance(account.getBalance() + deposit.getBalance() + interest);
                    accountRepository.save(account);
                    depositRepository.delete(deposit);
                }
            }
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
        TransactionDto transactionDto = TransactionDto
                .builder()
                .account(account)
                .accountAmountAfter(account.getBalance())
                .accountCurrency(account.getCurrency())
                .amount(depositBalance)
                .assignedAccountNumber(account.getId())
                .category("Inne")
                .currency(account.getCurrency())
                .date(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .hour(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status("blockade")
                .title("Założenie nowej lokaty.")
                .type("outgoing")
                .build();
        Transaction transaction = this.transactionMapper.convertToTransaction(transactionDto);
        this.transactionRepository.save(transaction);
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
