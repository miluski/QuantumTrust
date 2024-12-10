package com.quantum.trust.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

import com.quantum.trust.backend.services.CookieService;
import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

public class JwtRequestFilterTest {

    @Mock
    private TokenService tokenService;

    @Mock
    private CookieService cookieService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private TokenBucketService tokenBucketService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtRequestFilter jwtRequestFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    public void testDoFilterInternal_AllowedUri() throws ServletException, IOException {
        request.setRequestURI("/api/auth/login");
        jwtRequestFilter.doFilterInternal(request, response, filterChain);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    public void testDoFilterInternal_TooManyRequests() throws ServletException, IOException {
        request.setRequestURI("/api/protected");
        when(cookieService.getCookieValue(any(), anyString())).thenReturn("ACCESS_TOKEN");
        when(tokenBucketService.tryConsume()).thenReturn(false);
        jwtRequestFilter.doFilterInternal(request, response, filterChain);
        assertEquals(HttpStatus.TOO_MANY_REQUESTS.value(), response.getStatus());
        assertEquals("Too many requests. Try again later.", response.getContentAsString());
    }

    @Test
    void testDoFilterInternal_invalidToken() throws ServletException, IOException {
        String token = "invalid_token";
        String identificator = "invalid_identificator";
        request.setRequestURI("/api/user/protected");
        when(tokenBucketService.tryConsume()).thenReturn(true);
        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(token);
        when(tokenService.validateToken(token, identificator)).thenReturn(false);
        when(tokenService.getIdentificatorFromToken(token)).thenReturn(identificator);
        jwtRequestFilter.doFilterInternal(request, response, filterChain);
        assertEquals(response.getStatus(), HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    void testDoFilterInternal_validTokenAndAuthenticate() throws ServletException, IOException {
        String token = "valid_token";
        String identificator = "valid_identificator";
        UserDetails userDetails = mock(UserDetails.class);
        request.setRequestURI("/api/user/protected");
        when(tokenBucketService.tryConsume()).thenReturn(true);
        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(token);
        when(tokenService.validateToken(token, identificator)).thenReturn(true);
        when(tokenService.getIdentificatorFromToken(token)).thenReturn(identificator);
        when(userAuthService.loadUserByUsername(identificator)).thenReturn(userDetails);
        jwtRequestFilter.doFilterInternal(request, response, filterChain);
        verify(filterChain).doFilter(request, response);
    }
}