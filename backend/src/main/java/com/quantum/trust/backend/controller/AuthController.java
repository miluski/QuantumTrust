package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.model.dto.EncryptedRegistrationDto;
import com.quantum.trust.backend.services.UserService;
import com.quantum.trust.backend.services.VerificationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final VerificationService verificationService;

    @Autowired
    public AuthController(VerificationService verificationService, UserService userService) {
        this.verificationService = verificationService;
        this.userService = userService;
    }

    @GetMapping("/check")
    public ResponseEntity<?> isTokenPresentAndValid() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login/verification/send-email")
    public ResponseEntity<?> sendLoginVerificationEmail(@RequestBody String encryptedId,
            HttpServletResponse httpServletResponse) {
        return this.verificationService.handleLoginVerification(encryptedId, httpServletResponse);
    }

    @PostMapping("/register/verification/send-email")
    public ResponseEntity<?> sendRegisterVerificationEmail(@RequestBody String encryptedEmail,
            HttpServletResponse httpServletResponse) {
        return this.verificationService.handleRegisterVerification(encryptedEmail, httpServletResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody String encryptedUserDto, HttpServletResponse httpServletResponse) {
        return this.userService.login(encryptedUserDto, httpServletResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody EncryptedRegistrationDto encryptedDto) {
        return this.userService.registerNewAccount(encryptedDto.getEncryptedUserDto(),
                encryptedDto.getEncryptedAccountDto());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        return this.userService.refreshToken(httpServletRequest, httpServletResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> handleLogout(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        return this.userService.removeTokens(httpServletRequest, httpServletResponse);
    }
}
