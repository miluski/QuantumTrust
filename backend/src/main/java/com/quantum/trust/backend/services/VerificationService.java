package com.quantum.trust.backend.services;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class VerificationService {
    private String verificationCode;

    private final ObjectMapper objectMapper;
    private final CryptoService cryptoService;
    private final CookieService cookieService;
    private final EmailService emailService;
    private final UserService userService;
    private final ValidationService validationService;
    private final UserRepository userRepository;

    @Autowired
    public VerificationService(CryptoService cryptoService, ValidationService validationService,
            ObjectMapper objectMapper, CookieService cookieService, UserService userService,
            EmailService emailService, UserRepository userRepository) {
        this.cryptoService = cryptoService;
        this.validationService = validationService;
        this.objectMapper = objectMapper;
        this.cookieService = cookieService;
        this.userService = userService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> handleRegisterVerification(String encryptedObject,
            HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedObject);
            String decryptedEmail = this.cryptoService.decryptData(jsonNode.get("encryptedData").asText());
            boolean isUserExists = this.userService.isEmailExists(decryptedEmail);
            if (isUserExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else {
                return this.sendVerificationCode(decryptedEmail, "rejestrację", httpServletResponse);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> handleLoginVerification(String encryptedId, HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedId);
            String decryptedId = this.cryptoService.decryptData(jsonNode.get("encryptedData").asText());
            Optional<User> user = this.userRepository.findById(Long.valueOf(decryptedId));
            if (user.isPresent()) {
                return this.sendVerificationCode(user.get().getEmailAddress(), "logowanie", httpServletResponse);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> sendVerificationCode(String email, String operation,
            HttpServletResponse httpServletResponse) {
        boolean isEmailValid = this.validationService.validateEmail(email);
        if (isEmailValid) {
            this.verificationCode = this.generateSixDigitCode();
            boolean isSendedSuccessfull = this.emailService.sendVerificationCode(email, verificationCode, operation);
            String encryptedCode = this.cryptoService.encryptData(this.verificationCode);
            Cookie responseCookie = this.cookieService.generateCookie("VERIFICATION_CODE", encryptedCode, false,
                    30);
            httpServletResponse.addCookie(responseCookie);
            return isSendedSuccessfull ? ResponseEntity.status(HttpStatus.OK).build()
                    : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } else {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
        }
    }

    private String generateSixDigitCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
