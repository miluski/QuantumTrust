package com.quantum.trust.backend.model;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

public class LimitsTest {

    @Test
    public void testNoArgsConstructor() {
        Limits limits = new Limits();
        assertNotNull(limits);
        assertNull(limits.getInternetTransactions());
        assertNull(limits.getCashTransactions());
    }

    @Test
    public void testAllArgsConstructor() {
        Float[] internetTransactions = { 100.0f, 200.0f };
        Float[] cashTransactions = { 50.0f, 75.0f };
        Limits limits = new Limits(internetTransactions, cashTransactions);
        assertArrayEquals(internetTransactions, limits.getInternetTransactions());
        assertArrayEquals(cashTransactions, limits.getCashTransactions());
    }

    @Test
    public void testSettersAndGetters() {
        Limits limits = new Limits();
        Float[] internetTransactions = { 100.0f, 200.0f };
        Float[] cashTransactions = { 50.0f, 75.0f };
        limits.setInternetTransactions(internetTransactions);
        limits.setCashTransactions(cashTransactions);
        assertArrayEquals(internetTransactions, limits.getInternetTransactions());
        assertArrayEquals(cashTransactions, limits.getCashTransactions());
    }

    @Test
    public void testToString() {
        Float[] internetTransactions = { 100.0f, 200.0f };
        Float[] cashTransactions = { 50.0f, 75.0f };
        Limits limits = new Limits(internetTransactions, cashTransactions);
        String expectedString = "Limits(internetTransactions=[100.0, 200.0], cashTransactions=[50.0, 75.0])";
        assertEquals(expectedString, limits.toString());
    }
}