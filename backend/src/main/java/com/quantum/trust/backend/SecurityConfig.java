package com.quantum.trust.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.Filter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final TokenService tokenService;
    private final UserAuthService userAuthService;
    private final TokenBucketService tokenBucketService;

    @Autowired
    public SecurityConfig(TokenService tokenService, UserAuthService userAuthService,
            TokenBucketService tokenBucketService) {
        this.tokenService = tokenService;
        this.userAuthService = userAuthService;
        this.tokenBucketService = tokenBucketService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((customizer) -> customizer
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/media/public/**").permitAll()
                        .requestMatchers("/api/auth/test/tokens").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling((customizer) -> customizer.authenticationEntryPoint(
                        (request, response, exception) -> {
                            response.sendError(HttpStatus.UNAUTHORIZED.value());
                            exception.printStackTrace();
                        }))
                .addFilterBefore(this.getJwtRequestFilter(), UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    private Filter getJwtRequestFilter() {
        return new JwtRequestFilter(tokenService, userAuthService, tokenBucketService);
    }

}