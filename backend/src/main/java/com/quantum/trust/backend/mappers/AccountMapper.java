package com.quantum.trust.backend.mappers;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.entities.Account;

@Component
public class AccountMapper {
    public AccountDto convertToAccountDto(Account account) {
        return AccountDto
                .builder()
                .id(account.getId())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .image(account.getImage())
                .type(account.getType())
                .build();
    }

    public Account convertToAccount(AccountDto accountDto) {
        return Account
                .builder()
                .balance(accountDto.getBalance())
                .currency(accountDto.getCurrency())
                .image(accountDto.getImage())
                .type(accountDto.getType())
                .build();
    }
}
