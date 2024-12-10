package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

class CryptoServiceTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    private CryptoService cryptoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        cryptoService = new CryptoService(passwordEncoder);
        cryptoService.encryptKey = "/urpXJY0b3CFG7Y9ZvKvMcAZCS9cRnIF54C3982anI8=";
    }

    @Test
    void testEncryptData_ShouldEncryptSuccessfully() throws Exception {
        String input = "Hello, World!";
        String encryptedData = cryptoService.encryptData(input);
        assertNotNull(encryptedData, "Encrypted data should not be null");
        assertFalse(encryptedData.isEmpty(), "Encrypted data should not be empty");
        System.out.println("Encrypted data: " + encryptedData);
    }

    @Test
    void testDecryptData_ShouldDecryptSuccessfully() throws Exception {
        String input = "Hello, World!";
        String encryptedData = cryptoService.encryptData(input);
        String decryptedData = cryptoService.decryptData(encryptedData);
        assertEquals(input, decryptedData, "Decrypted data should match the original input");
    }

    @Test
    void testEncryptAndDecryptJsonObject() throws Exception {
        TestObject testObject = new TestObject("John Doe", 30);
        String encryptedData = cryptoService.encryptData(testObject);
        String decryptedData = cryptoService.decryptData(encryptedData);
        assertTrue(decryptedData.contains("John Doe"), "Decrypted data should contain the original name");
        assertTrue(decryptedData.contains("30"), "Decrypted data should contain the original age");
    }

    @Test
    void testGetEncryptedPassword_ShouldEncryptPassword() {
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        String result = cryptoService.getEncryptedPassword(rawPassword);
        assertEquals(encodedPassword, result, "PasswordEncoder should encode the password correctly");
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }

    static class TestObject {
        private String name;
        private int age;

        public TestObject(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }
    }
}