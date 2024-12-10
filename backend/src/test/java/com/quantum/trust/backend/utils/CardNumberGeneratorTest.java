package com.quantum.trust.backend.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.Serializable;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class CardNumberGeneratorTest {

    private CardNumberGenerator cardNumberGenerator;
    private SharedSessionContractImplementor session;

    @BeforeEach
    public void setUp() {
        cardNumberGenerator = new CardNumberGenerator();
        session = Mockito.mock(SharedSessionContractImplementor.class);
    }

    @Test
    public void testGenerateCardNumberNotNull() {
        Serializable cardNumber = cardNumberGenerator.generate(session, new Object());
        assertNotNull(cardNumber, "Generated card number should not be null");
    }

    @Test
    public void testGenerateCardNumberLength() {
        Serializable cardNumber = cardNumberGenerator.generate(session, new Object());
        assertEquals(16, cardNumber.toString().length(), "Generated card number should be 16 digits long");
    }

    @Test
    public void testGenerateCardNumberDigits() {
        Serializable cardNumber = cardNumberGenerator.generate(session, new Object());
        String cardNumberStr = cardNumber.toString();
        assertTrue(cardNumberStr.matches("\\d{16}"), "Generated card number should contain only digits");
    }
}