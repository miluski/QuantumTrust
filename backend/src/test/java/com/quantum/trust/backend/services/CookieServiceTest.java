package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class CookieServiceTest {

    private CookieService cookieService;

    @BeforeEach
    public void setUp() {
        cookieService = new CookieService();
    }

    @Test
    public void testGenerateCookie() {
        String cookieName = "testCookie";
        String cookieValue = "testValue";
        boolean isHttpOnly = true;
        int expirationTime = 3600;
        Cookie cookie = cookieService.generateCookie(cookieName, cookieValue, isHttpOnly, expirationTime);
        assertEquals(cookieName, cookie.getName());
        assertEquals(cookieValue, cookie.getValue());
        assertEquals(expirationTime, cookie.getMaxAge());
        assertEquals(true, cookie.getSecure());
        assertEquals(isHttpOnly, cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals("Lax", cookie.getAttribute("SameSite"));
    }

    @Test
    public void testGetCookieValue() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String cookieName = "testCookie";
        String cookieValue = "testValue";
        Cookie[] cookies = { new Cookie(cookieName, cookieValue) };
        when(request.getCookies()).thenReturn(cookies);
        String result = cookieService.getCookieValue(request, cookieName);
        assertEquals(cookieValue, result);
    }

    @Test
    public void testGetCookieValue_NoCookies() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getCookies()).thenReturn(null);
        String result = cookieService.getCookieValue(request, "testCookie");
        assertNull(result);
    }

    @Test
    public void testGetCookieValue_CookieNotFound() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        Cookie[] cookies = { new Cookie("otherCookie", "otherValue") };
        when(request.getCookies()).thenReturn(cookies);
        String result = cookieService.getCookieValue(request, "testCookie");
        assertNull(result);
    }
}