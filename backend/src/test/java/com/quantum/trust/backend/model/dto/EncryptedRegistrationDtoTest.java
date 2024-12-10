package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class EncryptedRegistrationDtoTest {

    @Test
    public void testNoArgsConstructor() {
        EncryptedRegistrationDto dto = new EncryptedRegistrationDto();
        assertNotNull(dto);
    }

    @Test
    public void testAllArgsConstructor() {
        EncryptedRegistrationDto dto = new EncryptedRegistrationDto("encryptedAccount", "encryptedUser");
        assertNotNull(dto);
        assertEquals("encryptedAccount", dto.getEncryptedAccountDto());
        assertEquals("encryptedUser", dto.getEncryptedUserDto());
    }

    @Test
    public void testSettersAndGetters() {
        EncryptedRegistrationDto dto = new EncryptedRegistrationDto();
        dto.setEncryptedAccountDto("encryptedAccount");
        dto.setEncryptedUserDto("encryptedUser");
        assertEquals("encryptedAccount", dto.getEncryptedAccountDto());
        assertEquals("encryptedUser", dto.getEncryptedUserDto());
    }

    @Test
    public void testToString() {
        EncryptedRegistrationDto dto = new EncryptedRegistrationDto("encryptedAccount", "encryptedUser");
        String expectedString = "EncryptedRegistrationDto(encryptedAccountDto=encryptedAccount, encryptedUserDto=encryptedUser)";
        assertEquals(expectedString, dto.toString());
    }
}