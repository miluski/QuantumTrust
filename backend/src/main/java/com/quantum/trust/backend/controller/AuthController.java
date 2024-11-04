package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.TokenService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TokenService tokenService;

    @Autowired
    public AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/test/tokens")
    public ResponseEntity<?> getTokens() {
        return ResponseEntity.ok().body(this.tokenService.generateToken("1", "access"));
    }
    
}
