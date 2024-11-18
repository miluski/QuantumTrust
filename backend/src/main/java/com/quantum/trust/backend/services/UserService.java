package com.quantum.trust.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.mappers.UserMapper;
import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {
    private User savedAccount;

    private final UserMapper userMapper;
    private final AccountMapper accountMapper;
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final CryptoService cryptoService;
    private final EmailService emailService;
    private final ValidationService validationService;
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserMapper userMapper,
            AccountMapper accountMapper, TokenService tokenService, CookieService cookieService,
            CryptoService cryptoService,
            EmailService emailService,
            ValidationService validationService, TransactionService transactionService,
            ObjectMapper objectMapper,
            UserRepository userRepository, AccountRepository accountRepository,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.accountMapper = accountMapper;
        this.cryptoService = cryptoService;
        this.objectMapper = objectMapper;
        this.emailService = emailService;
        this.validationService = validationService;
        this.transactionService = transactionService;
        this.cookieService = cookieService;
    }

    public ResponseEntity<?> registerNewAccount(String encryptedUserDto, String encryptedAccountDto) {
        try {
            ResponseEntity<?> accountResponse = this.createUserAccount(encryptedUserDto);
            boolean isAccountProperlySaved = accountResponse.getStatusCode().equals(HttpStatus.OK);
            if (isAccountProperlySaved) {
                String decryptedAccountDto = this.cryptoService.decryptData(encryptedAccountDto);
                decryptedAccountDto = decryptedAccountDto.replace("\\", "\"");
                AccountDto accountDto = objectMapper.readValue(decryptedAccountDto, AccountDto.class);
                Account account = this.accountMapper.convertToAccount(accountDto);
                TransactionDto transactionDto = this.transactionService.createStartTransactionDto(account);
                account.setUser(this.savedAccount);
                this.validationService.validateAccountObject(account);
                account.setBalance(this.transactionService.getInitialAmount(account));
                this.accountRepository.save(account);
                this.transactionService.saveNewTransaction(transactionDto);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                return accountResponse;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> createUserAccount(String encryptedUserDto) {
        try {
            User user = this.getUser(encryptedUserDto);
            this.validationService.validateUserObject(user);
            user.setPassword(this.cryptoService.getEncryptedPassword(user.getPassword()));
            this.savedAccount = this.userRepository.save(user);
            this.emailService.sendIdentificator(user);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> login(String encryptedUserDto, HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedUserDto);
            String loginData = jsonNode.get("loginData").asText();
            User user = this.getUser(loginData);
            this.validationService.validateLoginUserObject(user);
            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getId(), user.getPassword());
            this.authenticationManager.authenticate(authentication);
            String accessToken = this.tokenService.generateToken(user.getId().toString(), "access");
            String refreshToken = this.tokenService.generateToken(user.getId().toString(), "refresh");
            Cookie accessTokenCookie = this.cookieService.generateCookie("ACCESS_TOKEN", accessToken, true, 60);
            Cookie refreshTokenCookie = this.cookieService.generateCookie("REFRESH_TOKEN", refreshToken, true, 300);
            httpServletResponse.addCookie(accessTokenCookie);
            httpServletResponse.addCookie(refreshTokenCookie);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public boolean isEmailExists(String userEmail) {
        try {
            User user = this.userRepository.findByEmailAddress(userEmail);
            return true && user != null;
        } catch (NullPointerException e) {
            return false;
        }
    }

    private User getUser(String encryptedUserDto) {
        try {
            String decryptedUserDto = this.cryptoService.decryptData(encryptedUserDto);
            decryptedUserDto = decryptedUserDto.replace("\\", "\"");
            UserDto userDto = objectMapper.readValue(decryptedUserDto, UserDto.class);
            User user = this.userMapper.convertToUser(userDto);
            return user;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }
}
