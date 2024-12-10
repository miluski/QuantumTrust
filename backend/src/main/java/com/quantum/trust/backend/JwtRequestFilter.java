package com.quantum.trust.backend;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.quantum.trust.backend.services.CookieService;
import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @component JwtRequestFilter
 * @description Filter class for validating JWT tokens in HTTP requests.
 *
 * @class JwtRequestFilter
 *
 * @constructor
 *              Initializes the JwtRequestFilter with the specified services.
 * @param {TokenService}       tokenService - The service for handling tokens.
 * @param {CookieService}      cookieService - The service for handling cookies.
 * @param {UserAuthService}    userAuthService - The service for handling user
 *                             authentication.
 * @param {TokenBucketService} tokenBucketService - The service for handling
 *                             token bucket operations.
 *
 * @method doFilterInternal - Filters incoming HTTP requests to validate JWT
 *         tokens.
 * @param {HttpServletRequest}  request - The HTTP servlet request.
 * @param {HttpServletResponse} response - The HTTP servlet response.
 * @param {FilterChain}         filterChain - The filter chain.
 * @throws {ServletException} - If an error occurs during filtering.
 * @throws {IOException}      - If an I/O error occurs during filtering.
 *
 * @method setCredentials - Sets the credentials from the request.
 * @param {HttpServletRequest} request - The HTTP servlet request.
 *
 * @method getAuthHeader - Retrieves the authorization header from the request.
 * @param {HttpServletRequest} request - The HTTP servlet request.
 * @returns {String} - The authorization header.
 *
 * @method setToken - Sets the token from the authorization header.
 *
 * @method setIdentificator - Sets the identificator from the token.
 *
 * @method setAuthentication - Sets the authentication in the security context.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final UserAuthService userAuthService;
    private final TokenBucketService tokenBucketService;
    private final List<String> allowedUris;

    private String token;
    private String authHeader;
    private String identificator;
    private HttpServletRequest request;

    @Autowired
    public JwtRequestFilter(TokenService tokenService, CookieService cookieService, UserAuthService userAuthService,
            TokenBucketService tokenBucketService) {
        this.tokenService = tokenService;
        this.userAuthService = userAuthService;
        this.tokenBucketService = tokenBucketService;
        this.cookieService = cookieService;
        this.allowedUris = List.of("/api/media/public", "/api/auth/login", "/api/auth/login/verification/send-email",
                "/api/auth/register/verification/send-email",
                "/api/auth/register", "/api/user/id", "/api/user/email", "/api/auth/refresh-token");
    }

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        boolean isAllowedUri = this.allowedUris.stream().anyMatch(request.getRequestURI()::contains);
        if (isAllowedUri) {
            filterChain.doFilter(request, response);
            return;
        }
        this.setCredentials(request);
        if (this.token != null && !tokenBucketService.tryConsume()) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Try again later.");
            return;
        }
        if (identificator != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (tokenService.validateToken(token, identificator)) {
                this.setAuthentication();
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Unauthorized");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void setCredentials(HttpServletRequest request) {
        this.request = request;
        this.authHeader = this.getAuthHeader(request);
        this.setToken();
        this.setIdentificator();
    }

    private String getAuthHeader(HttpServletRequest request) {
        boolean isRequestCanBeVerifiedWithAnyToken = request.getRequestURI().contains("/api/auth/logout")
                || request.getRequestURI().contains("/api/check");
        return "Bearer "
                + this.cookieService.getCookieValue(request,
                        isRequestCanBeVerifiedWithAnyToken ? "REFRESH_TOKEN" : "ACCESS_TOKEN");
    }

    private void setToken() {
        if (this.authHeader != null && this.authHeader.startsWith("Bearer ")) {
            this.token = this.authHeader.substring(7);
        }
    }

    private void setIdentificator() {
        if (this.authHeader != null && this.authHeader.startsWith("Bearer ")) {
            this.identificator = this.tokenService.getIdentificatorFromToken(this.token);
        }
    }

    private void setAuthentication() {
        UserDetails userDetails = this.userAuthService.loadUserByUsername(this.identificator);
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        usernamePasswordAuthenticationToken
                .setDetails(new WebAuthenticationDetailsSource().buildDetails(this.request));
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }
}