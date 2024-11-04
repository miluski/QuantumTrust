package com.quantum.trust.backend;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserAuthService userAuthService;
    private final TokenBucketService tokenBucketService;

    @Autowired
    public JwtRequestFilter(TokenService tokenService, UserAuthService userAuthService,
            TokenBucketService tokenBucketService) {
        this.tokenService = tokenService;
        this.userAuthService = userAuthService;
        this.tokenBucketService = tokenBucketService;
    }

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().contains("/api/media/public")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String identificator = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            identificator = this.tokenService.getIdentificatorFromToken(token);

            if (token != null && !tokenBucketService.tryConsume()) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Try again later.");
                return;
            }
        }
        if (identificator != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userAuthService.loadUserByUsername(identificator);
            if (tokenService.validateToken(token, identificator)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Unauthorized");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}