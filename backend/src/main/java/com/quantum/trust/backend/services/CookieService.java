package com.quantum.trust.backend.services;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class CookieService {
    public Cookie generateCookie(String cookieName, String cookieValue, boolean isHttpOnly, int expirationTime) {
        Cookie cookie = new Cookie(cookieName, cookieValue);
        cookie.setMaxAge(expirationTime);
        cookie.setSecure(true);
        cookie.setHttpOnly(isHttpOnly);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    public String getCookieValue(HttpServletRequest httpServletRequest, String cookieName) {
        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : httpServletRequest.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
