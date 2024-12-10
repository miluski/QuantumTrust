package com.quantum.trust.backend.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;

public class DepositMapperTest {

    private DepositMapper depositMapper;

    @BeforeEach
    public void setUp() {
        depositMapper = new DepositMapper();
    }

    @Test
    public void testConvertToDepositDto() {
        Deposit deposit = Deposit.builder()
                .id("1")
                .account(new Account())
                .balance(1000.0f)
                .currency("USD")
                .duration(12)
                .endDate("2023-12-31")
                .percent(5.0f)
                .type("Fixed")
                .build();
        DepositDto depositDto = depositMapper.convertToDepositDto(deposit);
        assertNotNull(depositDto);
        assertEquals(deposit.getId(), depositDto.getId());
        assertEquals(deposit.getAccount().toString(), depositDto.getAssignedAccountNumber());
        assertEquals(deposit.getBalance(), depositDto.getBalance());
        assertEquals(deposit.getCurrency(), depositDto.getCurrency());
        assertEquals(deposit.getDuration(), depositDto.getDuration());
        assertEquals(deposit.getEndDate(), depositDto.getEndDate());
        assertEquals(deposit.getPercent(), depositDto.getPercent());
        assertEquals(deposit.getType(), depositDto.getType());
    }

    @Test
    public void testConvertToDeposit() {
        DepositDto depositDto = DepositDto.builder()
                .balance(1000.0f)
                .currency("USD")
                .duration(12)
                .endDate("2023-12-31")
                .percent(5.0f)
                .type("Fixed")
                .build();
        Deposit deposit = depositMapper.convertToDeposit(depositDto);
        assertNotNull(deposit);
        assertEquals(depositDto.getBalance(), deposit.getBalance());
        assertEquals(depositDto.getCurrency(), deposit.getCurrency());
        assertEquals(depositDto.getDuration(), deposit.getDuration());
        assertEquals(depositDto.getEndDate(), deposit.getEndDate());
        assertEquals(depositDto.getPercent(), deposit.getPercent());
        assertEquals(depositDto.getType(), deposit.getType());
    }
}