package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto EncryptedRegistrationDto
 * @description Data Transfer Object for encrypted registration data.
 *
 * @class EncryptedRegistrationDto
 *
 * @field {String} encryptedAccountDto - The encrypted account data.
 * @field {String} encryptedUserDto - The encrypted user data.
 */
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class EncryptedRegistrationDto implements Serializable {
    private String encryptedAccountDto;
    private String encryptedUserDto;
}
