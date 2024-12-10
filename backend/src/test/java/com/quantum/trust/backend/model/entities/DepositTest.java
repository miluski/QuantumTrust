package com.quantum.trust.backend.model.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class DepositTest {

    private Deposit deposit;

    @BeforeEach
    public void setUp() {
        deposit = Deposit.builder()
                .id("DE1234567890")
                .type("Savings")
                .percent(2.5f)
                .balance(1000.0f)
                .currency("USD")
                .endDate("2023-12-31")
                .account(new Account("ACC1234567890", null, null, null, null, null))
                .duration(12)
                .build();
    }

    @Test
    public void testDepositNotNull() {
        assertNotNull(deposit);
    }

    @Test
    public void testDepositId() {
        assertEquals("DE1234567890", deposit.getId());
    }

    @Test
    public void testDepositType() {
        assertEquals("Savings", deposit.getType());
    }

    @Test
    public void testDepositPercent() {
        assertEquals(2.5f, deposit.getPercent());
    }

    @Test
    public void testDepositBalance() {
        assertEquals(1000.0f, deposit.getBalance());
    }

    @Test
    public void testDepositCurrency() {
        assertEquals("USD", deposit.getCurrency());
    }

    @Test
    public void testDepositEndDate() {
        assertEquals("2023-12-31", deposit.getEndDate());
    }

    @Test
    public void testDepositAccount() {
        assertNotNull(deposit.getAccount());
        assertEquals("ACC1234567890", deposit.getAccount().getId());
    }

    @Test
    public void testDepositDuration() {
        assertEquals(12, deposit.getDuration());
    }
}