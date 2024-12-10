package com.quantum.trust.backend.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.entities.Account;

public class AccountMapperTest {

    private AccountMapper accountMapper;

    @BeforeEach
    public void setUp() {
        accountMapper = new AccountMapper();
    }

    @Test
    public void testConvertToAccountDto() {
        Account account = Account.builder()
                .id("1")
                .balance(1000.0f)
                .currency("USD")
                .image("image.png")
                .type("SAVINGS")
                .build();
        AccountDto accountDto = accountMapper.convertToAccountDto(account);
        assertEquals(account.getId(), accountDto.getId());
        assertEquals(account.getBalance(), accountDto.getBalance());
        assertEquals(account.getCurrency(), accountDto.getCurrency());
        assertEquals(account.getImage(), accountDto.getImage());
        assertEquals(account.getType(), accountDto.getType());
    }

    @Test
    public void testConvertToAccount() {
        AccountDto accountDto = AccountDto.builder()
                .id("1")
                .balance(1000.0f)
                .currency("USD")
                .image("image.png")
                .type("SAVINGS")
                .build();
        Account account = accountMapper.convertToAccount(accountDto);
        assertNull(account.getId()); 
        assertEquals(accountDto.getBalance(), account.getBalance());
        assertEquals(accountDto.getCurrency(), account.getCurrency());
        assertEquals(accountDto.getImage(), account.getImage());
        assertEquals(accountDto.getType(), account.getType());
    }
}