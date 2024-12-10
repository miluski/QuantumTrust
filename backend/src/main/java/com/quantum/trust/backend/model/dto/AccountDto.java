package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto AccountDto
 * @description Data Transfer Object for Account entities.
 *
 * @class AccountDto
 *
 * @field {String} id - The unique identifier of the account.
 * @field {String} image - The image associated with the account.
 * @field {String} type - The type of the account.
 * @field {Float} balance - The balance of the account.
 * @field {String} currency - The currency of the account.
 */
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
public class AccountDto implements Serializable {
    private String id;
    private String image;
    private String type;
    private Float balance;
    private String currency;
}
