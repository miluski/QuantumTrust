package com.quantum.trust.backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;

import com.quantum.trust.backend.services.CookieService;
import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.Filter;

public class SecurityConfigTest {

    @Mock
    private TokenService tokenService;

    @Mock
    private CookieService cookieService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private TokenBucketService tokenBucketService;

    @Mock
    private ObjectPostProcessor<Object> objectPostProcessor;

    @InjectMocks
    private SecurityConfig securityConfig;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAuthenticationManager() {
        AuthenticationManager authenticationManager = securityConfig.authenticationManager();
        assertNotNull(authenticationManager);
    }

    @Test
    public void testPasswordEncoder() {
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        assertNotNull(passwordEncoder);
    }

    @Test
    public void testGetCorsConfigurationSource() {
        CorsConfigurationSource corsConfigurationSource = securityConfig.getCorsConfigurationSource();
        assertNotNull(corsConfigurationSource);
    }

    @Test
    public void testGetJwtRequestFilter() {
        Filter jwtRequestFilter = securityConfig.getJwtRequestFilter();
        assertNotNull(jwtRequestFilter);
    }
}