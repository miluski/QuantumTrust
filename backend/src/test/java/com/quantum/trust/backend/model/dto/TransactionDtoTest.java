package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

public class TransactionDtoTest {

    @Test
    public void testTransactionDtoBuilder() {
        Account account = new Account();
        Card card = new Card();
        TransactionDto transactionDto = TransactionDto.builder()
                .id(1L)
                .date("2023-10-01")
                .hour("12:00")
                .title("Test Transaction")
                .account(account)
                .card(card)
                .assignedAccountNumber("123456789")
                .type("Credit")
                .amount(100.0f)
                .currency("USD")
                .accountAmountAfter(200.0f)
                .category("Shopping")
                .accountCurrency("USD")
                .status("Completed")
                .build();
        assertNotNull(transactionDto);
        assertEquals(1L, transactionDto.getId());
        assertEquals("2023-10-01", transactionDto.getDate());
        assertEquals("12:00", transactionDto.getHour());
        assertEquals("Test Transaction", transactionDto.getTitle());
        assertEquals(account, transactionDto.getAccount());
        assertEquals(card, transactionDto.getCard());
        assertEquals("123456789", transactionDto.getAssignedAccountNumber());
        assertEquals("Credit", transactionDto.getType());
        assertEquals(100.0f, transactionDto.getAmount());
        assertEquals("USD", transactionDto.getCurrency());
        assertEquals(200.0f, transactionDto.getAccountAmountAfter());
        assertEquals("Shopping", transactionDto.getCategory());
        assertEquals("USD", transactionDto.getAccountCurrency());
        assertEquals("Completed", transactionDto.getStatus());
    }

    @Test
    public void testTransactionDtoSettersAndGetters() {
        Account account = new Account();
        Card card = new Card();
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setId(1L);
        transactionDto.setDate("2023-10-01");
        transactionDto.setHour("12:00");
        transactionDto.setTitle("Test Transaction");
        transactionDto.setAccount(account);
        transactionDto.setCard(card);
        transactionDto.setAssignedAccountNumber("123456789");
        transactionDto.setType("Credit");
        transactionDto.setAmount(100.0f);
        transactionDto.setCurrency("USD");
        transactionDto.setAccountAmountAfter(200.0f);
        transactionDto.setCategory("Shopping");
        transactionDto.setAccountCurrency("USD");
        transactionDto.setStatus("Completed");
        assertEquals(1L, transactionDto.getId());
        assertEquals("2023-10-01", transactionDto.getDate());
        assertEquals("12:00", transactionDto.getHour());
        assertEquals("Test Transaction", transactionDto.getTitle());
        assertEquals(account, transactionDto.getAccount());
        assertEquals(card, transactionDto.getCard());
        assertEquals("123456789", transactionDto.getAssignedAccountNumber());
        assertEquals("Credit", transactionDto.getType());
        assertEquals(100.0f, transactionDto.getAmount());
        assertEquals("USD", transactionDto.getCurrency());
        assertEquals(200.0f, transactionDto.getAccountAmountAfter());
        assertEquals("Shopping", transactionDto.getCategory());
        assertEquals("USD", transactionDto.getAccountCurrency());
        assertEquals("Completed", transactionDto.getStatus());
    }
}