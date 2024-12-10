package com.quantum.trust.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.quantum.trust.backend.services.AccountService;
import com.quantum.trust.backend.services.TransactionService;
import com.quantum.trust.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

class UserControllerTest {

        @Mock
        private UserService userService;

        @Mock
        private AccountService accountService;

        @Mock
        private TransactionService transactionService;

        @InjectMocks
        private UserController userController;

        private MockMvc mockMvc;

        @BeforeEach
        void setup() {
                MockitoAnnotations.openMocks(this);
                mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        }

        @Test
        void testFindUserWithId_UserExists() throws Exception {
                String userId = "12345";
                when(userService.isIdentifierExists(userId)).thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(get("/api/user/id").param("id", userId))
                                .andExpect(status().isOk());
                verify(userService, times(1)).isIdentifierExists(userId);
        }

        @Test
        void testFindUserWithEmail_UserExists() throws Exception {
                String email = "user@example.com";
                when(userService.isEmailExists(email)).thenReturn(true);
                mockMvc.perform(get("/api/user/email").param("email", email))
                                .andExpect(status().isOk());
                verify(userService, times(1)).isEmailExists(email);
        }

        @Test
        void testFindUserWithEmail_UserNotExists() throws Exception {
                String email = "user@example.com";
                when(userService.isEmailExists(email)).thenReturn(false);
                mockMvc.perform(get("/api/user/email").param("email", email))
                                .andExpect(status().isNotFound());
                verify(userService, times(1)).isEmailExists(email);
        }

        @Test
        void testGetAllUserAccounts() throws Exception {
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                when(accountService.getAllAccountsFromUserId(any(HttpServletRequest.class)))
                                .thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(get("/api/user/all-accounts")
                                .requestAttr("mockRequest", mockRequest))
                                .andExpect(status().isOk());
                verify(accountService, times(1)).getAllAccountsFromUserId(any(HttpServletRequest.class));
        }

        @Test
        void testGetAllUserTransactions() throws Exception {
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                when(transactionService.getAllUserTransactions(mockRequest)).thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(get("/api/user/all-transactions"))
                                .andExpect(status().isOk());
                verify(transactionService, times(1)).getAllUserTransactions(any(HttpServletRequest.class));
        }

        @Test
        void testGetIsAccountExists_Exists() throws Exception {
                String accountNumber = "ACC123";
                when(userService.getIsAccountExists(accountNumber)).thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(post("/api/user/account").param("accountNumber", accountNumber))
                                .andExpect(status().isOk());
                verify(userService, times(1)).getIsAccountExists(accountNumber);
        }

        @Test
        void testOpenNewAccount() throws Exception {
                String encryptedAccountDto = "encryptedData";
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                when(userService.saveNewBankAccount(any(HttpServletRequest.class), eq(encryptedAccountDto)))
                                .thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(post("/api/user/account/open")
                                .content(encryptedAccountDto)
                                .contentType("application/json")
                                .requestAttr("mockRequest", mockRequest))
                                .andExpect(status().isOk());
                verify(userService, times(1)).saveNewBankAccount(any(HttpServletRequest.class),
                                eq(encryptedAccountDto));
        }

        @Test
        void testSendNewTransfer() throws Exception {
                String encryptedTransferDto = "transferData";
                when(userService.sendNewTransfer(encryptedTransferDto)).thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(post("/api/user/new-transfer").content(encryptedTransferDto)
                                .contentType("application/json"))
                                .andExpect(status().isOk());
                verify(userService, times(1)).sendNewTransfer(encryptedTransferDto);
        }

        @Test
        void testEditUser() throws Exception {
                String encryptedUserObject = "userData";
                HttpServletRequest mockRequest = mock(HttpServletRequest.class);
                when(userService.editUserAccount(eq(encryptedUserObject), any(HttpServletRequest.class)))
                                .thenReturn(ResponseEntity.ok().build());
                mockMvc.perform(patch("/api/user/edit")
                                .content(encryptedUserObject)
                                .contentType("application/json")
                                .requestAttr("mockRequest", mockRequest))
                                .andExpect(status().isOk());
                verify(userService, times(1)).editUserAccount(eq(encryptedUserObject), any(HttpServletRequest.class));
        }
}