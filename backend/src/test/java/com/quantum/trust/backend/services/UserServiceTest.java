package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.mappers.UserMapper;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.HttpServletResponse;

public class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private TokenService tokenService;

    @Mock
    private CookieService cookieService;

    @Mock
    private CryptoService cryptoService;

    @Mock
    private EmailService emailService;

    @Mock
    private MediaService mediaService;

    @Mock
    private ValidationService validationService;

    @Mock
    private TransactionService transactionService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterNewAccount_Success() {
        String encryptedUserDto = "encryptedUserDto";
        String encryptedAccountDto = "encryptedAccountDto";
        UserService userService = Mockito.mock(UserService.class);
        doReturn(ResponseEntity.status(HttpStatus.OK).build()).when(userService).createUserAccount(encryptedUserDto);
        doReturn(ResponseEntity.status(HttpStatus.OK).build()).when(userService)
                .saveNewBankAccount(encryptedAccountDto);
        doReturn(ResponseEntity.status(HttpStatus.OK).build()).when(userService).registerNewAccount(encryptedUserDto,
                encryptedAccountDto);
        ResponseEntity<?> response = userService.registerNewAccount(encryptedUserDto, encryptedAccountDto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testRegisterNewAccount_Failure_AccountNotSaved() {
        String encryptedUserDto = "encryptedUserDto";
        String encryptedAccountDto = "encryptedAccountDto";
        UserService userService = Mockito.mock(UserService.class);
        doReturn(ResponseEntity.status(HttpStatus.OK).build()).when(userService).createUserAccount(encryptedUserDto);
        doReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()).when(userService)
                .saveNewBankAccount(encryptedAccountDto);
        doReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()).when(userService).registerNewAccount(
                encryptedUserDto,
                encryptedAccountDto);
        ResponseEntity<?> response = userService.registerNewAccount(encryptedUserDto, encryptedAccountDto);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode(),
                "The status code should be INTERNAL_SERVER_ERROR.");
    }

    @Test
    public void testCreateUserAccount_Success() throws Exception {
        String encryptedUserDto = "encryptedUserDto";
        User user = new User();
        user.setPassword("example");
        when(cryptoService.decryptData(anyString())).thenReturn("decryptedPassword");
        when(userMapper.convertToUser(any())).thenReturn(user);
        when(userRepository.save(any())).thenReturn(user);
        ResponseEntity<?> response = userService.createUserAccount(encryptedUserDto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(emailService, times(1)).sendIdentificator(any(User.class));
    }

    @Test
    public void testCreateUserAccount_Failure() throws Exception {
        String encryptedUserDto = "encryptedUserDto";
        when(cryptoService.decryptData(anyString())).thenThrow(new RuntimeException());
        ResponseEntity<?> response = userService.createUserAccount(encryptedUserDto);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testLogin_Success() throws Exception {
        String encryptedUserDto = "encryptedUserDto";
        HttpServletResponse httpServletResponse = mock(HttpServletResponse.class);
        User user = new User();
        user.setId(1L);
        user.setPassword("password");
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(anyString())).thenReturn(jsonNode);
        when(jsonNode.get(anyString())).thenReturn(mock(JsonNode.class));
        when(jsonNode.get("loginData").asText()).thenReturn("loginData");
        when(userMapper.convertToUser(any())).thenReturn(user);
        when(cryptoService.decryptData(anyString())).thenReturn("decryptedPassword");
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        ResponseEntity<?> response = userService.login(encryptedUserDto, httpServletResponse);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(cookieService, times(2)).generateCookie(anyString(), any(), anyBoolean(), anyInt());
    }

    @Test
    public void testLogin_Failure() throws Exception {
        String encryptedUserDto = "encryptedUserDto";
        HttpServletResponse httpServletResponse = mock(HttpServletResponse.class);
        when(objectMapper.readTree(anyString())).thenThrow(new RuntimeException());
        ResponseEntity<?> response = userService.login(encryptedUserDto, httpServletResponse);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testIsEmailExists_True() throws Exception {
        String encryptedEmail = "encryptedEmail";
        User user = new User();
        when(cryptoService.decryptData(anyString())).thenReturn("decryptedEmail");
        when(userRepository.findByEmailAddress(anyString())).thenReturn(user);
        boolean result = userService.isEmailExists(encryptedEmail);
        assertTrue(result);
    }

    @Test
    public void testIsEmailExists_False() throws Exception {
        String encryptedEmail = "encryptedEmail";
        when(cryptoService.decryptData(anyString())).thenReturn("decryptedEmail");
        when(userRepository.findByEmailAddress(anyString())).thenReturn(null);
        boolean result = userService.isEmailExists(encryptedEmail);
        assertFalse(result);
    }

    @Test
    public void testIsIdentifierExists_True() throws Exception {
        String encryptedId = "encryptedId";
        User user = new User();
        when(cryptoService.decryptData(anyString())).thenReturn("1");
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        ResponseEntity<?> response = userService.isIdentifierExists(encryptedId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testIsIdentifierExists_False() throws Exception {
        String encryptedId = "encryptedId";
        when(cryptoService.decryptData(anyString())).thenReturn("1");
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());
        ResponseEntity<?> response = userService.isIdentifierExists(encryptedId);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}