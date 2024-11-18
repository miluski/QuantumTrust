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

@Service
public class CryptoService {

    @Value("${encrypt.key}")
    private String encryptKey;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CryptoService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String encryptData(Object data) {
        try {
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
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String decryptData(String encryptedData) {
        try {
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
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getEncryptedPassword(String password) {
        return this.passwordEncoder.encode(password);
    }

}
