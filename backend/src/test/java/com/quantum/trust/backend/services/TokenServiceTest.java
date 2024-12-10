package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.ExpiredJwtException;

public class TokenServiceTest {

    @InjectMocks
    private TokenService tokenService;

    @Mock
    private Date mockDate;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(tokenService, "jwtSecret",
                "b4g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7");
        ReflectionTestUtils.setField(tokenService, "expiration", 3600000L);
        ReflectionTestUtils.setField(tokenService, "refreshExpiration", 7200000L);
    }

    @Test
    public void testGenerateToken() {
        String identificator = "testUser";
        String token = tokenService.generateToken(identificator, "access");
        String extractedIdentificator = tokenService.getIdentificatorFromToken(token);
        assertEquals(identificator, extractedIdentificator);
    }

    @Test
    public void testValidateToken() {
        String identificator = "testUser";
        String token = tokenService.generateToken(identificator, "access");
        assertTrue(tokenService.validateToken(token, identificator));
    }

    @Test
    public void testValidateToken_InvalidIdentificator() {
        String identificator = "testUser";
        String token = tokenService.generateToken(identificator, "access");
        assertFalse(tokenService.validateToken(token, "invalidUser"));
    }

    @Test
    public void testValidateToken_ExpiredToken() throws InterruptedException {
        ReflectionTestUtils.setField(tokenService, "expiration", 1L);
        String identificator = "testUser";
        String token = tokenService.generateToken(identificator, "access");
        Thread.sleep(2);
        assertThrows(ExpiredJwtException.class, () -> tokenService.validateToken(token, identificator));
    }

    @Test
    public void testValidateToken_MalformedToken() {
        String malformedToken = "malformedToken";
        assertFalse(tokenService.validateToken(malformedToken, "testUser"));
    }
}