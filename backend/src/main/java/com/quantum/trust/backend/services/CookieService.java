package com.quantum.trust.backend.services;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * @service CookieService
 * @description Service class for managing cookies.
 *
 * @class CookieService
 *
 * @method generateCookie - Generates a new cookie with the specified
 *         parameters.
 * @param {String}  cookieName - The name of the cookie.
 * @param {String}  cookieValue - The value of the cookie.
 * @param {boolean} isHttpOnly - Whether the cookie is HTTP only.
 * @param {int}     expirationTime - The expiration time of the cookie in
 *                  seconds.
 * @returns {Cookie} - The generated cookie.
 *
 * @method getCookieValue - Retrieves the value of a cookie by its name from the
 *         HTTP request.
 * @param {HttpServletRequest} httpServletRequest - The HTTP servlet request.
 * @param {String}             cookieName - The name of the cookie to retrieve.
 * @returns {String} - The value of the cookie, or null if not found.
 */
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
