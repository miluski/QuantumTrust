package com.quantum.trust.backend.services;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * @service TokenService
 * 
 * @description Service class for handling JWT token generation and validation.
 *
 * @class TokenService
 *
 * @constructor
 *              Initializes the TokenService with the specified JWT secret and
 *              expiration times.
 *
 * @method validateToken - Validates a JWT token.
 * @param {String} token - The JWT token to validate.
 * @param {String} identificator - The identificator to validate against.
 * @returns {Boolean} - True if the token is valid, false otherwise.
 *
 * @method generateToken - Generates a JWT token.
 * @param {String} identificator - The identificator to include in the token.
 * @param {String} tokenType - The type of the token (e.g., "access" or
 *                 "refresh").
 * @returns {String} - The generated JWT token.
 *
 * @method getIdentificatorFromToken - Retrieves the identificator from a JWT
 *         token.
 * @param {String} token - The JWT token.
 * @returns {String} - The identificator extracted from the token.
 *
 * @method getExpirationFromToken - Retrieves the expiration date from a JWT
 *         token.
 * @param {String} token - The JWT token.
 * @returns {Date} - The expiration date extracted from the token.
 *
 * @method getClaim - Retrieves a specific claim from a JWT token.
 * @param {String}          token - The JWT token.
 * @param {Function<Claims, T>} claimsResolver - A function to extract the claim
 *                          from the token.
 * @returns {T} - The extracted claim.
 *
 * @method getAllClaimsFromToken - Retrieves all claims from a JWT token.
 * @param {String} token - The JWT token.
 * @returns {Claims} - The claims extracted from the token.
 *
 * @method getRefreshTokenExpirationDate - Retrieves the expiration date for a
 *         refresh token.
 * @returns {Date} - The expiration date for a refresh token.
 *
 * @method getTokenExpirationDate - Retrieves the expiration date for an access
 *         token.
 * @returns {Date} - The expiration date for an access token.
 *
 * @method getKey - Retrieves the signing key for JWT tokens.
 * @returns {Key} - The signing key.
 */
@Service
public class TokenService {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private Long expiration;
    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    public Boolean validateToken(String token, String identificator) {
        try {
            final String tokenIdentificator = this.getIdentificatorFromToken(token);
            final Date tokenExpiration = this.getExpirationFromToken(token);
            return tokenIdentificator.equals(identificator) && !tokenExpiration.before(new Date());
        } catch (MalformedJwtException e) {
            return false;
        }
    }

    public String generateToken(String identificator, String tokenType) {
        final boolean isRefreshToken = tokenType.equals("refresh");
        final Date expirationDate = isRefreshToken ? getRefreshTokenExpirationDate() : getTokenExpirationDate();
        return Jwts
                .builder()
                .setClaims(new HashMap<>())
                .setSubject(identificator)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(expirationDate)
                .signWith(this.getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getIdentificatorFromToken(String token) {
        return this.getClaim(token, Claims::getSubject);
    }

    private Date getExpirationFromToken(String token) {
        return this.getClaim(token, Claims::getExpiration);
    }

    private <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Date getRefreshTokenExpirationDate() {
        return new Date(System.currentTimeMillis() + refreshExpiration);
    }

    private Date getTokenExpirationDate() {
        return new Date(System.currentTimeMillis() + expiration);
    }

    private Key getKey() {
        return new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }
}