package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class DepositDtoTest {

    @Test
    public void testDepositDtoBuilder() {
        DepositDto depositDto = DepositDto.builder()
                .id("1")
                .type("Savings")
                .percent(2.5f)
                .balance(1000.0f)
                .currency("USD")
                .endDate("2023-12-31")
                .assignedAccountNumber("123456789")
                .duration(12)
                .build();
        assertNotNull(depositDto);
        assertEquals("1", depositDto.getId());
        assertEquals("Savings", depositDto.getType());
        assertEquals(2.5f, depositDto.getPercent());
        assertEquals(1000.0f, depositDto.getBalance());
        assertEquals("USD", depositDto.getCurrency());
        assertEquals("2023-12-31", depositDto.getEndDate());
        assertEquals("123456789", depositDto.getAssignedAccountNumber());
        assertEquals(12, depositDto.getDuration());
    }

    @Test
    public void testDepositDtoSettersAndGetters() {
        DepositDto depositDto = new DepositDto();
        depositDto.setId("2");
        depositDto.setType("Fixed");
        depositDto.setPercent(3.0f);
        depositDto.setBalance(2000.0f);
        depositDto.setCurrency("EUR");
        depositDto.setEndDate("2024-06-30");
        depositDto.setAssignedAccountNumber("987654321");
        depositDto.setDuration(24);
        assertEquals("2", depositDto.getId());
        assertEquals("Fixed", depositDto.getType());
        assertEquals(3.0f, depositDto.getPercent());
        assertEquals(2000.0f, depositDto.getBalance());
        assertEquals("EUR", depositDto.getCurrency());
        assertEquals("2024-06-30", depositDto.getEndDate());
        assertEquals("987654321", depositDto.getAssignedAccountNumber());
        assertEquals(24, depositDto.getDuration());
    }

    @Test
    public void testDepositDtoNoArgsConstructor() {
        DepositDto depositDto = new DepositDto();
        assertNotNull(depositDto);
    }

    @Test
    public void testDepositDtoAllArgsConstructor() {
        DepositDto depositDto = new DepositDto("3", "Current", 1.5f, 500.0f, "GBP", "2025-01-01", "1122334455", 6);
        assertNotNull(depositDto);
        assertEquals("3", depositDto.getId());
        assertEquals("Current", depositDto.getType());
        assertEquals(1.5f, depositDto.getPercent());
        assertEquals(500.0f, depositDto.getBalance());
        assertEquals("GBP", depositDto.getCurrency());
        assertEquals("2025-01-01", depositDto.getEndDate());
        assertEquals("1122334455", depositDto.getAssignedAccountNumber());
        assertEquals(6, depositDto.getDuration());
    }
}