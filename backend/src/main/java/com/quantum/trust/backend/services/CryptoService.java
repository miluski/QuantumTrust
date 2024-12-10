package com.quantum.trust.backend.services;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @service CryptoService
 * @description Service class for handling encryption and decryption.
 *
 * @class CryptoService
 *
 * @constructor
 * @param {PasswordEncoder} passwordEncoder - Encoder for hashing passwords.
 *
 * @method encryptData - Encrypts the given data using AES encryption.
 * @param {Object} data - The data to be encrypted.
 * @returns {String} - The encrypted data as a Base64 encoded string.
 *
 * @method decryptData - Decrypts the given encrypted data using AES decryption.
 * @param {String} encryptedData - The encrypted data as a Base64 encoded
 *                 string.
 * @returns {String} - The decrypted data as a string.
 *
 * @method getEncryptedPassword - Encrypts the given password using the password
 *         encoder.
 * @param {String} password - The password to be encrypted.
 * @returns {String} - The encrypted password.
 */
@Service
public class CryptoService {
    @Value("${encrypt.key}")
    String encryptKey;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CryptoService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String encryptData(Object data) throws Exception {
        byte[] iv = new byte[16];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        byte[] decodedKey = Base64.getDecoder().decode(this.encryptKey);
        SecretKeySpec keySpec = new SecretKeySpec(decodedKey, "AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParameterSpec);
        String jsonData = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(data);
        byte[] encryptedBytes = cipher.doFinal(jsonData.getBytes(StandardCharsets.UTF_8));
        byte[] encryptedDataWithIv = new byte[iv.length + encryptedBytes.length];
        System.arraycopy(iv, 0, encryptedDataWithIv, 0, iv.length);
        System.arraycopy(encryptedBytes, 0, encryptedDataWithIv, iv.length, encryptedBytes.length);
        return Base64.getEncoder().encodeToString(encryptedDataWithIv);
    }

    public String decryptData(String encryptedData) throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(this.encryptKey);
        SecretKeySpec keySpec = new SecretKeySpec(decodedKey, "AES");
        byte[] decodedValue = Base64.getDecoder().decode(encryptedData);
        byte[] iv = new byte[16];
        byte[] ciphertext = new byte[decodedValue.length - 16];
        System.arraycopy(decodedValue, 0, iv, 0, 16);
        System.arraycopy(decodedValue, 16, ciphertext, 0, ciphertext.length);
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv));
        byte[] decryptedValue = cipher.doFinal(ciphertext);
        return new String(decryptedValue, "UTF-8").replace("\"", "");
    }

    public String getEncryptedPassword(String password) {
        return this.passwordEncoder.encode(password);
    }
}
