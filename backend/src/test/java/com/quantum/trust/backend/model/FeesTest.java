package com.quantum.trust.backend.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class FeesTest {

    @Test
    public void testNoArgsConstructor() {
        Fees fees = new Fees();
        assertNotNull(fees);
        assertEquals(0.0f, fees.getRelease());
        assertEquals(0.0f, fees.getMonthly());
    }

    @Test
    public void testAllArgsConstructor() {
        Fees fees = new Fees(10.0f, 20.0f);
        assertEquals(10.0f, fees.getRelease());
        assertEquals(20.0f, fees.getMonthly());
    }

    @Test
    public void testSettersAndGetters() {
        Fees fees = new Fees();
        fees.setRelease(15.0f);
        fees.setMonthly(25.0f);
        assertEquals(15.0f, fees.getRelease());
        assertEquals(25.0f, fees.getMonthly());
    }

    @Test
    public void testToString() {
        Fees fees = new Fees(5.0f, 10.0f);
        String expected = "Fees(release=5.0, monthly=10.0)";
        assertEquals(expected, fees.toString());
    }
}