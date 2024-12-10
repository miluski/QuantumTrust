package com.quantum.trust.backend;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.quantum.trust.backend.services.CookieService;
import com.quantum.trust.backend.services.TokenBucketService;
import com.quantum.trust.backend.services.TokenService;
import com.quantum.trust.backend.services.UserAuthService;

import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;

/**
 * @class SecurityConfig
 * @description Configuration class for setting up security configurations.
 *
 * @constructor
 *              Initializes the SecurityConfig with the specified services.
 * @param {TokenService}       tokenService - The service for handling tokens.
 * @param {CookieService}      cookieService - The service for handling cookies.
 * @param {UserAuthService}    userAuthService - The service for user
 *                             authentication.
 * @param {TokenBucketService} tokenBucketService - The service for rate
 *                             limiting.
 *
 * @method authenticationManager - Configures the authentication manager.
 * @returns {AuthenticationManager} - The configured authentication manager.
 *
 * @method passwordEncoder - Configures the password encoder.
 * @returns {PasswordEncoder} - The configured password encoder.
 *
 * @method securityFilterChain - Configures the security filter chain.
 * @param {HttpSecurity} httpSecurity - The HttpSecurity object to configure.
 * @returns {SecurityFilterChain} - The configured security filter chain.
 *
 * @method getCorsConfigurationSource - Configures the CORS settings.
 * @returns {CorsConfigurationSource} - The configured CORS settings.
 *
 * @method getJwtRequestFilter - Configures the JWT request filter.
 * @returns {Filter} - The configured JWT request filter.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final UserAuthService userAuthService;
    private final TokenBucketService tokenBucketService;

    @Autowired
    public SecurityConfig(TokenService tokenService, CookieService cookieService, UserAuthService userAuthService,
            TokenBucketService tokenBucketService) {
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.userAuthService = userAuthService;
        this.tokenBucketService = tokenBucketService;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userAuthService);
        authenticationProvider.setPasswordEncoder(this.passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(16, 32, 1, 4096, 3);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors((customizer) -> customizer.configurationSource(this.getCorsConfigurationSource()))
                .authorizeHttpRequests((customizer) -> customizer
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/login/verification/send-email").permitAll()
                        .requestMatchers("/api/auth/register/verification/send-email").permitAll()
                        .requestMatchers("/api/user/id").permitAll()
                        .requestMatchers("/api/user/email").permitAll()
                        .requestMatchers("/api/auth/refresh-token").permitAll()
                        .requestMatchers("/api/media/public/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(this.getJwtRequestFilter(), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling((customizer) -> customizer.authenticationEntryPoint(
                        (request, response, exception) -> {
                            response.sendError(HttpStatus.UNAUTHORIZED.value());
                            exception.printStackTrace();
                        }));
        return httpSecurity.build();
    }

    CorsConfigurationSource getCorsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(
                    @SuppressWarnings("null") HttpServletRequest httpServletRequest) {
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                corsConfiguration.setAllowCredentials(true);
                corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));
                corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
                corsConfiguration.setAllowedOrigins(Arrays.asList("https://192.168.0.14:4200"));
                corsConfiguration.addExposedHeader("Set-Cookie");
                corsConfiguration.setMaxAge(5L);
                return corsConfiguration;
            }
        };
    }

    Filter getJwtRequestFilter() {
        return new JwtRequestFilter(tokenService, cookieService, userAuthService, tokenBucketService);
    }
}