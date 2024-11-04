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
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private Long expiration;
    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    public Boolean validateToken(String token, String identificator) {
        final String tokenIdentificator = this.getIdentificatorFromToken(token);
        final Date tokenExpiration = this.getExpirationFromToken(token);
        return tokenIdentificator.equals(identificator) && !tokenExpiration.before(new Date());
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