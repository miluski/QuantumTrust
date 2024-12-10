package com.quantum.trust.backend.mappers;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.entities.Account;

/**
 * @component AccountMapper
 * @description Mapper class for converting between Account entities and Account
 *              DTOs.
 *
 * @class AccountMapper
 *
 * @method convertToAccountDto - Converts an Account entity to an AccountDto.
 * @param {Account} account - The Account entity to convert.
 * @returns {AccountDto} - The converted AccountDto.
 *
 * @method convertToAccount - Converts an AccountDto to an Account entity.
 * @param {AccountDto} accountDto - The AccountDto to convert.
 * @returns {Account} - The converted Account entity.
 */
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
