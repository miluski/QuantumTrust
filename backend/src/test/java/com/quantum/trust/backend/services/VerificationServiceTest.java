package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class VerificationServiceTest {

    @Mock
    private CryptoService cryptoService;

    @Mock
    private ValidationService validationService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private CookieService cookieService;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VerificationService verificationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testHandleRegisterVerification_UserExists() throws Exception {
        String encryptedObject = "{\"encryptedData\":\"encryptedEmail\"}";
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedObject)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedEmail");
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("decryptedEmail");
        when(userService.isEmailExists("encryptedEmail")).thenReturn(true);
        ResponseEntity<?> result = verificationService.handleRegisterVerification(encryptedObject, response);
        assert (result.getStatusCode() == HttpStatus.CONFLICT);
    }

    @Test
    public void testHandleRegisterVerification_InvalidEmail() throws Exception {
        String encryptedObject = "{\"encryptedData\":\"encryptedEmail\"}";
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedObject)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedEmail");
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("decryptedEmail");
        when(userService.isEmailExists("encryptedEmail")).thenReturn(false);
        when(validationService.validateEmail("decryptedEmail")).thenReturn(false);
        ResponseEntity<?> result = verificationService.handleRegisterVerification(encryptedObject, response);
        assert (result.getStatusCode() == HttpStatus.CONFLICT);
    }

    @Test
    public void testHandleRegisterVerification_Success() throws Exception {
        String encryptedObject = "{\"encryptedData\":\"encryptedEmail\"}";
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedObject)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedEmail");
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("decryptedEmail");
        when(userService.isEmailExists("encryptedEmail")).thenReturn(false);
        when(validationService.validateEmail("decryptedEmail")).thenReturn(true);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString(), anyString());
        ResponseEntity<?> result = verificationService.handleRegisterVerification(encryptedObject, response);
        assert (result.getStatusCode() == HttpStatus.OK);
    }

    @Test
    public void testHandleLoginVerification_UserNotFound() throws Exception {
        String encryptedId = "{\"encryptedData\":\"encryptedId\"}";
        HttpServletResponse response = mock(HttpServletResponse.class);

        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedId)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedId");
        when(cryptoService.decryptData("encryptedId")).thenReturn("1");
        when(userRepository.findById(Long.valueOf("1"))).thenReturn(Optional.empty());

        ResponseEntity<?> result = verificationService.handleLoginVerification(encryptedId, response);

        assert (result.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    public void testHandleLoginVerification_UnprocessableWithInvalidEmail() throws Exception {
        String encryptedId = "{\"encryptedData\":\"encryptedId\"}";
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedId)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedId");
        when(cryptoService.decryptData("encryptedId")).thenReturn("1");
        User user = new User();
        user.setEmailAddress("encryptedEmail");
        when(userRepository.findById(Long.valueOf("1"))).thenReturn(Optional.of(user));
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("invalidEmail");
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString(), anyString());
        ResponseEntity<?> result = verificationService.handleLoginVerification(encryptedId, response);
        assertEquals(result.getStatusCode(), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    public void testHandleOperationVerification_UserNotFound() throws Exception {
        String encryptedOperation = "{\"encryptedData\":\"encryptedOperation\"}";
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode jsonNode = mock(JsonNode.class);
        when(objectMapper.readTree(encryptedOperation)).thenReturn(jsonNode);
        when(jsonNode.get("encryptedData")).thenReturn(jsonNode);
        when(jsonNode.asText()).thenReturn("encryptedOperation");
        when(cryptoService.decryptData("encryptedOperation")).thenReturn("decryptedOperation");
        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn("token");
        when(tokenService.getIdentificatorFromToken("token")).thenReturn("1");
        when(userRepository.findById(Long.valueOf("1"))).thenReturn(Optional.empty());
        ResponseEntity<?> result = verificationService.handleOperationVerification(encryptedOperation, request,
                response);
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }
}