package com.quantum.trust.backend.services;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;

@Service
public class CookieService {

    public Cookie generateCookie(String cookieName, String cookieValue, boolean isHttpOnly, int expirationTime) {
        Cookie cookie = new Cookie(cookieName, cookieValue);
        cookie.setMaxAge(expirationTime);
        cookie.setSecure(true);
        cookie.setHttpOnly(isHttpOnly);
        cookie.setPath("/");
        return cookie;
    }

}
