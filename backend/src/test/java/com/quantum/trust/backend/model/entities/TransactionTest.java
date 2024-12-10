package com.quantum.trust.backend.model.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class TransactionTest {

    @Test
    public void testTransactionBuilder() {
        Account account = new Account();
        Card card = new Card();
        Transaction transaction = Transaction.builder()
                .id(1L)
                .date("2023-10-01")
                .hour("12:00")
                .title("Test Transaction")
                .account(account)
                .card(card)
                .type("Debit")
                .amount(100.0f)
                .currency("USD")
                .accountAmountAfter(900.0f)
                .category("Groceries")
                .accountCurrency("USD")
                .status("Completed")
                .build();
        assertNotNull(transaction);
        assertEquals(1L, transaction.getId());
        assertEquals("2023-10-01", transaction.getDate());
        assertEquals("12:00", transaction.getHour());
        assertEquals("Test Transaction", transaction.getTitle());
        assertEquals(account, transaction.getAccount());
        assertEquals(card, transaction.getCard());
        assertEquals("Debit", transaction.getType());
        assertEquals(100.0f, transaction.getAmount());
        assertEquals("USD", transaction.getCurrency());
        assertEquals(900.0f, transaction.getAccountAmountAfter());
        assertEquals("Groceries", transaction.getCategory());
        assertEquals("USD", transaction.getAccountCurrency());
        assertEquals("Completed", transaction.getStatus());
    }

    @Test
    public void testTransactionSettersAndGetters() {
        Transaction transaction = new Transaction();
        Account account = new Account();
        Card card = new Card();
        transaction.setId(1L);
        transaction.setDate("2023-10-01");
        transaction.setHour("12:00");
        transaction.setTitle("Test Transaction");
        transaction.setAccount(account);
        transaction.setCard(card);
        transaction.setType("Debit");
        transaction.setAmount(100.0f);
        transaction.setCurrency("USD");
        transaction.setAccountAmountAfter(900.0f);
        transaction.setCategory("Groceries");
        transaction.setAccountCurrency("USD");
        transaction.setStatus("Completed");
        assertEquals(1L, transaction.getId());
        assertEquals("2023-10-01", transaction.getDate());
        assertEquals("12:00", transaction.getHour());
        assertEquals("Test Transaction", transaction.getTitle());
        assertEquals(account, transaction.getAccount());
        assertEquals(card, transaction.getCard());
        assertEquals("Debit", transaction.getType());
        assertEquals(100.0f, transaction.getAmount());
        assertEquals("USD", transaction.getCurrency());
        assertEquals(900.0f, transaction.getAccountAmountAfter());
        assertEquals("Groceries", transaction.getCategory());
        assertEquals("USD", transaction.getAccountCurrency());
        assertEquals("Completed", transaction.getStatus());
    }
}