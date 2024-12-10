package com.quantum.trust.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quantum.trust.backend.model.dto.EncryptedRegistrationDto;
import com.quantum.trust.backend.services.UserService;
import com.quantum.trust.backend.services.VerificationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

class AuthControllerTest {

        @Mock
        private UserService userService;

        @Mock
        private VerificationService verificationService;

        @InjectMocks
        private AuthController authController;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
        }

        @Test
        void testIsTokenPresentAndValid() {
                ResponseEntity<?> response = authController.isTokenPresentAndValid();
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertTrue(response.getBody() instanceof HashMap);
        }

        @Test
        void testSendLoginVerificationEmail() {
                String encryptedId = "encryptedId";
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(verificationService.handleLoginVerification(encryptedId, mockResponse))
                                .thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.sendLoginVerificationEmail(encryptedId, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(verificationService, times(1)).handleLoginVerification(encryptedId, mockResponse);
        }

        @Test
        void testSendRegisterVerificationEmail() {
                String encryptedEmail = "encryptedEmail";
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(verificationService.handleRegisterVerification(encryptedEmail, mockResponse))
                                .thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.sendRegisterVerificationEmail(encryptedEmail, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(verificationService, times(1)).handleRegisterVerification(encryptedEmail, mockResponse);
        }

        @Test
        void testSendOperationVerificationEmail() {
                String encryptedOperation = "encryptedOperation";
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(verificationService.handleOperationVerification(encryptedOperation, mockRequest, mockResponse))
                                .thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.sendOperationVerificationEmail(encryptedOperation,
                                mockRequest, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(verificationService, times(1)).handleOperationVerification(encryptedOperation, mockRequest,
                                mockResponse);
        }

        @Test
        void testLoginUser() {
                String encryptedUserDto = "encryptedUserDto";
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(userService.login(encryptedUserDto, mockResponse)).thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.loginUser(encryptedUserDto, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(userService, times(1)).login(encryptedUserDto, mockResponse);
        }

        @Test
        void testRegisterUser() {
                EncryptedRegistrationDto mockDto = new EncryptedRegistrationDto("encryptedUserDto",
                                "encryptedAccountDto");
                when(userService.registerNewAccount(mockDto.getEncryptedUserDto(), mockDto.getEncryptedAccountDto()))
                                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).build());
                ResponseEntity<?> response = authController.registerUser(mockDto);
                assertNotNull(response);
                assertEquals(HttpStatus.CREATED, response.getStatusCode());
                verify(userService, times(1)).registerNewAccount(mockDto.getEncryptedUserDto(),
                                mockDto.getEncryptedAccountDto());
        }

        @Test
        void testRefreshAccessToken() {
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(userService.refreshToken(mockRequest, mockResponse)).thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.refreshAccessToken(mockRequest, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(userService, times(1)).refreshToken(mockRequest, mockResponse);
        }

        @Test
        void testHandleLogout() {
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                HttpServletResponse mockResponse = mock(HttpServletResponse.class);
                when(userService.removeTokens(mockRequest,
                                mockResponse)).thenReturn(ResponseEntity.ok().build());
                ResponseEntity<?> response = authController.handleLogout(mockRequest, mockResponse);
                assertNotNull(response);
                assertEquals(HttpStatus.OK, response.getStatusCode());
                verify(userService, times(1)).removeTokens(mockRequest, mockResponse);
        }
}