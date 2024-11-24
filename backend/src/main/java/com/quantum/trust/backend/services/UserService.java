package com.quantum.trust.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.mappers.UserMapper;
import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {
    private User savedUserAccount;
    private Account savedUserBankAccount;

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
        ResponseEntity<?> accountResponse = this.createUserAccount(encryptedUserDto);
        boolean isAccountProperlySaved = accountResponse.getStatusCode().equals(HttpStatus.OK);
        return isAccountProperlySaved ? this.saveNewBankAccount(encryptedAccountDto) : accountResponse;
    }

    public ResponseEntity<?> createUserAccount(String encryptedUserDto) {
        try {
            User user = this.getUser(encryptedUserDto);
            user.setPassword(this.cryptoService.decryptData(user.getPassword()));
            this.validationService.validateUserObject(user);
            user.setPassword(this.cryptoService.getEncryptedPassword(user.getPassword()));
            this.savedUserAccount = this.userRepository.save(user);
            this.emailService.sendIdentificator(user);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            this.deleteUserAccount();
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> saveNewBankAccount(String encryptedAccountDto) {
        try {
            Account account = this.getUserAccountObject(encryptedAccountDto, false);
            this.savedUserBankAccount = this.accountRepository.save(account);
            TransactionDto transactionDto = this.transactionService.createStartTransactionDto(account);
            this.transactionService.saveNewTransaction(transactionDto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            this.deleteUserAccount();
            this.deleteUserBankAccount();
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> saveNewBankAccount(HttpServletRequest httpServletRequest, String encryptedAccountDto) {
        try {
            String token = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
            String identificatorFromToken = this.tokenService.getIdentificatorFromToken(token);
            Optional<User> user = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            if (user.isEmpty()) {
                throw new Exception("User not found");
            }
            this.savedUserAccount = user.get();
            Account account = this.getUserAccountObject(encryptedAccountDto, true);
            this.savedUserBankAccount = this.accountRepository.save(account);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getUserAccountObject(HttpServletRequest httpServletRequest) {
        try {
            String accessToken = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
            String identificatorFromToken = this.tokenService.getIdentificatorFromToken(accessToken);
            Optional<User> retrievedUser = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            if (retrievedUser.isPresent()) {
                UserDto userDto = this.userMapper.convertToUserDto(retrievedUser.get());
                String encryptedUserObject = this.cryptoService.encryptData(userDto);
                EncryptedDto encryptedDto = new EncryptedDto();
                encryptedDto.setEncryptedData(encryptedUserObject);
                return ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
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
            user.setPassword(this.cryptoService.decryptData(user.getPassword()));
            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getId(), user.getPassword());
            this.authenticationManager.authenticate(authentication);
            this.addTokensToResponse(httpServletResponse, user.getId().toString());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public ResponseEntity<?> removeTokens(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        String refreshToken = this.cookieService.getCookieValue(httpServletRequest, "REFRESH_TOKEN");
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(refreshToken);
        String accessToken = this.tokenService.generateToken(identificatorFromToken, "access");
        String newRefreshToken = this.tokenService.generateToken(identificatorFromToken, "refresh");
        Cookie accessTokenCookie = this.cookieService.generateCookie("ACCESS_TOKEN", accessToken, true, 0);
        Cookie refreshTokenCookie = this.cookieService.generateCookie("REFRESH_TOKEN", newRefreshToken, true, 0);
        httpServletResponse.addCookie(accessTokenCookie);
        httpServletResponse.addCookie(refreshTokenCookie);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public boolean isEmailExists(String encryptedEmail) {
        try {
            String userEmail = this.cryptoService.decryptData(encryptedEmail);
            User user = this.userRepository.findByEmailAddress(userEmail);
            return true && user != null;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public ResponseEntity<?> isIdentifierExists(String encryptedId) {
        try {
            String decryptedId = this.cryptoService.decryptData(encryptedId);
            Optional<User> user = this.userRepository.findById(Long.valueOf(decryptedId));
            return user.isPresent() ? ResponseEntity.status(HttpStatus.OK).build()
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> refreshToken(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        String refreshToken = this.cookieService.getCookieValue(httpServletRequest, "REFRESH_TOKEN");
        return refreshToken != null ? this.newTokensPair(refreshToken, httpServletResponse)
                : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    private Account getUserAccountObject(String encryptedAccountDto, boolean isForLoggedUser) throws Exception {
        String decryptedAccountDto = this.cryptoService.decryptData(encryptedAccountDto);
        decryptedAccountDto = decryptedAccountDto.replace("\\", "\"");
        AccountDto accountDto = objectMapper.readValue(decryptedAccountDto, AccountDto.class);
        Account account = this.accountMapper.convertToAccount(accountDto);
        account.setUser(this.savedUserAccount);
        this.validationService.validateAccountObject(account);
        if (isForLoggedUser == false) {
            account.setBalance(this.transactionService.getInitialAmount(account));
        }
        return account;
    }

    private User getUser(String encryptedUserDto) {
        try {
            String decryptedUserDto = this.cryptoService.decryptData(encryptedUserDto);
            decryptedUserDto = decryptedUserDto.replace("\\", "\"");
            UserDto userDto = objectMapper.readValue(decryptedUserDto, UserDto.class);
            return this.userMapper.convertToUser(userDto);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private ResponseEntity<?> newTokensPair(String refreshToken, HttpServletResponse httpServletResponse) {
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(refreshToken);
        boolean isIdentifierFromTokenValid = this.getIsIdentifierFromTokenExists(identificatorFromToken);
        boolean isRefreshTokenValid = this.tokenService.validateToken(refreshToken, identificatorFromToken);
        if (isIdentifierFromTokenValid && isRefreshTokenValid) {
            this.addTokensToResponse(httpServletResponse, identificatorFromToken);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    private boolean getIsIdentifierFromTokenExists(String identificatorFromToken) {
        try {
            Optional<User> userFromToken = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            return userFromToken.isPresent();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void addTokensToResponse(HttpServletResponse httpServletResponse, String userId) {
        String accessToken = this.tokenService.generateToken(userId, "access");
        String refreshToken = this.tokenService.generateToken(userId, "refresh");
        Cookie accessTokenCookie = this.cookieService.generateCookie("ACCESS_TOKEN", accessToken, true, 60);
        Cookie refreshTokenCookie = this.cookieService.generateCookie("REFRESH_TOKEN", refreshToken, true, 300);
        httpServletResponse.addCookie(accessTokenCookie);
        httpServletResponse.addCookie(refreshTokenCookie);
    }

    private void deleteUserAccount() {
        try {
            this.userRepository.delete(savedUserAccount);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deleteUserBankAccount() {
        try {
            this.accountRepository.delete(savedUserBankAccount);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
