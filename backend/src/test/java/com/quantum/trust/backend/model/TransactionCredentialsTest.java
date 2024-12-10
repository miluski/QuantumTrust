package com.quantum.trust.backend.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TransactionCredentialsTest {

    @Test
    public void testTransactionCredentialsConstructorAndGetters() {
        Float accountAmountAfter = 1000.0f;
        Float amount = 200.0f;
        String category = "Food";
        String status = "Completed";
        String title = "Grocery Shopping";
        String type = "Debit";
        TransactionCredentials transactionCredentials = new TransactionCredentials(
                accountAmountAfter, amount, category, status, title, type);
        assertEquals(accountAmountAfter, transactionCredentials.getAccountAmountAfter());
        assertEquals(amount, transactionCredentials.getAmount());
        assertEquals(category, transactionCredentials.getCategory());
        assertEquals(status, transactionCredentials.getStatus());
        assertEquals(title, transactionCredentials.getTitle());
        assertEquals(type, transactionCredentials.getType());
    }
}