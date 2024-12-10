package com.quantum.trust.backend.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.Serializable;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class PolishAccountNumberGeneratorTest {

    private PolishAccountNumberGenerator generator;
    private SharedSessionContractImplementor session;

    @BeforeEach
    public void setUp() {
        generator = new PolishAccountNumberGenerator();
        session = Mockito.mock(SharedSessionContractImplementor.class);
    }

    @Test
    public void testGenerateNotNull() {
        Serializable accountNumber = generator.generate(session, new Object());
        assertNotNull(accountNumber);
    }

    @Test
    public void testGenerateFormat() {
        Serializable accountNumber = generator.generate(session, new Object());
        String accountNumberStr = accountNumber.toString();
        assertTrue(accountNumberStr.matches("PL 49 1020 2892 \\d{4} \\d{4} \\d{4} \\d{4}"));
    }

    @Test
    public void testGenerateCountryCode() {
        Serializable accountNumber = generator.generate(session, new Object());
        String accountNumberStr = accountNumber.toString();
        assertTrue(accountNumberStr.startsWith("PL"));
    }

    @Test
    public void testGenerateCheckDigits() {
        Serializable accountNumber = generator.generate(session, new Object());
        String accountNumberStr = accountNumber.toString();
        assertEquals("49", accountNumberStr.substring(3, 5));
    }

    @Test
    public void testGenerateBankCode() {
        Serializable accountNumber = generator.generate(session, new Object());
        String accountNumberStr = accountNumber.toString();
        assertEquals("1020", accountNumberStr.substring(6, 10));
    }

    @Test
    public void testGenerateBranchCode() {
        Serializable accountNumber = generator.generate(session, new Object());
        String accountNumberStr = accountNumber.toString();
        assertEquals("2892", accountNumberStr.substring(11, 15));
    }
}