package com.quantum.trust.backend.mappers;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.entities.Deposit;

/**
 * @component DepositMapper
 * @description Mapper class for converting between Deposit entities and Deposit
 *              DTOs.
 *
 * @class DepositMapper
 *
 * @method convertToDepositDto - Converts a Deposit entity to a DepositDto.
 * @param {Deposit} deposit - The Deposit entity to convert.
 * @returns {DepositDto} - The converted DepositDto.
 *
 * @method convertToDeposit - Converts a DepositDto to a Deposit entity.
 * @param {DepositDto} depositDto - The DepositDto to convert.
 * @returns {Deposit} - The converted Deposit entity.
 */
@Component
public class DepositMapper {
    public DepositDto convertToDepositDto(Deposit deposit) {
        return DepositDto
                .builder()
                .id(deposit.getId())
                .assignedAccountNumber(deposit.getAccount().toString())
                .balance(deposit.getBalance())
                .currency(deposit.getCurrency())
                .duration(deposit.getDuration())
                .endDate(deposit.getEndDate())
                .percent(deposit.getPercent())
                .type(deposit.getType())
                .build();
    }

    public Deposit convertToDeposit(DepositDto depositDto) {
        return Deposit
                .builder()
                .balance(depositDto.getBalance())
                .currency(depositDto.getCurrency())
                .duration(depositDto.getDuration())
                .endDate(depositDto.getEndDate())
                .percent(depositDto.getPercent())
                .type(depositDto.getType())
                .build();
    }
}
