package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto DepositDto
 * @description Data Transfer Object for Deposit entities.
 *
 * @class DepositDto
 *
 * @field {String} id - The unique identifier of the deposit.
 * @field {String} type - The type of the deposit.
 * @field {Float} percent - The interest rate of the deposit.
 * @field {Float} balance - The balance of the deposit.
 * @field {String} currency - The currency of the deposit.
 * @field {String} endDate - The end date of the deposit.
 * @field {String} assignedAccountNumber - The account number assigned to the
 *        deposit.
 * @field {Integer} duration - The duration of the deposit in months.
 */
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class DepositDto implements Serializable {
    private String id;
    private String type;
    private Float percent;
    private Float balance;
    private String currency;
    private String endDate;
    private String assignedAccountNumber;
    private Integer duration;
}
