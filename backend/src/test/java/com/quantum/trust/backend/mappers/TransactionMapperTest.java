package com.quantum.trust.backend.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Transaction;

public class TransactionMapperTest {

    private TransactionMapper transactionMapper;

    @BeforeEach
    public void setUp() {
        transactionMapper = new TransactionMapper();
    }

    @Test
    public void testConvertToTransactionDto() {
        Account account = new Account();
        account.setId("account123");
        Transaction transaction = Transaction.builder()
                .id(1L)
                .account(account)
                .accountAmountAfter(1000.0f)
                .accountCurrency("USD")
                .amount(100.0f)
                .category("Food")
                .currency("USD")
                .date("2023-10-01")
                .hour("12:00")
                .status("Completed")
                .title("Grocery Shopping")
                .type("Debit")
                .build();
        TransactionDto transactionDto = transactionMapper.convertToTransactionDto(transaction);
        assertNotNull(transactionDto);
        assertEquals(1L, transactionDto.getId());
        assertEquals("account123", transactionDto.getAssignedAccountNumber());
        assertEquals(1000.0f, transactionDto.getAccountAmountAfter());
        assertEquals("USD", transactionDto.getAccountCurrency());
        assertEquals(100.0f, transactionDto.getAmount());
        assertEquals("Food", transactionDto.getCategory());
        assertEquals("USD", transactionDto.getCurrency());
        assertEquals("2023-10-01", transactionDto.getDate());
        assertEquals("12:00", transactionDto.getHour());
        assertEquals("Completed", transactionDto.getStatus());
        assertEquals("Grocery Shopping", transactionDto.getTitle());
        assertEquals("Debit", transactionDto.getType());
    }

    @Test
    public void testConvertToTransaction() {
        TransactionDto transactionDto = TransactionDto.builder()
                .accountAmountAfter(1000.0f)
                .accountCurrency("USD")
                .amount(100.0f)
                .category("Food")
                .currency("USD")
                .date("2023-10-01")
                .hour("12:00")
                .status("Completed")
                .title("Grocery Shopping")
                .type("Debit")
                .build();
        Transaction transaction = transactionMapper.convertToTransaction(transactionDto);
        assertNotNull(transaction);
        assertEquals(1000.0f, transaction.getAccountAmountAfter());
        assertEquals("USD", transaction.getAccountCurrency());
        assertEquals(100.0f, transaction.getAmount());
        assertEquals("Food", transaction.getCategory());
        assertEquals("USD", transaction.getCurrency());
        assertEquals("2023-10-01", transaction.getDate());
        assertEquals("12:00", transaction.getHour());
        assertEquals("Completed", transaction.getStatus());
        assertEquals("Grocery Shopping", transaction.getTitle());
        assertEquals("Debit", transaction.getType());
    }
}