package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

public class EncryptedDtoTest {

    @Test
    public void testNoArgsConstructor() {
        EncryptedDto dto = new EncryptedDto();
        assertNull(dto.getEncryptedData());
    }

    @Test
    public void testAllArgsConstructor() {
        String encryptedData = "encryptedData";
        EncryptedDto dto = new EncryptedDto(encryptedData);
        assertEquals(encryptedData, dto.getEncryptedData());
    }

    @Test
    public void testSettersAndGetters() {
        EncryptedDto dto = new EncryptedDto();
        String encryptedData = "encryptedData";
        dto.setEncryptedData(encryptedData);
        assertEquals(encryptedData, dto.getEncryptedData());
    }

    @Test
    public void testToString() {
        String encryptedData = "encryptedData";
        EncryptedDto dto = new EncryptedDto(encryptedData);
        String expectedString = "EncryptedDto(encryptedData=encryptedData)";
        assertEquals(expectedString, dto.toString());
    }
}