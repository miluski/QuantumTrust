package com.quantum.trust.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.mappers.DepositMapper;
import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.repositories.DepositRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class DepositService {
    private final AccountService accountService;
    private final CryptoService cryptoService;
    private final DepositMapper depositMapper;
    private final DepositRepository depositRepository;

    @Autowired
    public DepositService(AccountService accountService, CryptoService cryptoService, DepositMapper depositMapper,
            DepositRepository depositRepository) {
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.depositMapper = depositMapper;
        this.depositRepository = depositRepository;
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
