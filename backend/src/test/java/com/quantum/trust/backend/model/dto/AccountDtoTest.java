package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class AccountDtoTest {

    @Test
    public void testAccountDtoBuilder() {
        AccountDto accountDto = AccountDto.builder()
                .id("123")
                .image("image.png")
                .type("savings")
                .balance(1000.0f)
                .currency("USD")
                .build();
        assertEquals("123", accountDto.getId());
        assertEquals("image.png", accountDto.getImage());
        assertEquals("savings", accountDto.getType());
        assertEquals(1000.0f, accountDto.getBalance());
        assertEquals("USD", accountDto.getCurrency());
    }

    @Test
    public void testAccountDtoSettersAndGetters() {
        AccountDto accountDto = new AccountDto("123", "image.png", "savings", 1000.0f, "USD");
        accountDto.setId("456");
        accountDto.setImage("new_image.png");
        accountDto.setType("checking");
        accountDto.setBalance(2000.0f);
        accountDto.setCurrency("EUR");
        assertEquals("456", accountDto.getId());
        assertEquals("new_image.png", accountDto.getImage());
        assertEquals("checking", accountDto.getType());
        assertEquals(2000.0f, accountDto.getBalance());
        assertEquals("EUR", accountDto.getCurrency());
    }

    @Test
    public void testAccountDtoToString() {
        AccountDto accountDto = new AccountDto("123", "image.png", "savings", 1000.0f, "USD");
        String expectedString = "AccountDto(id=123, image=image.png, type=savings, balance=1000.0, currency=USD)";
        assertEquals(expectedString, accountDto.toString());
    }
}