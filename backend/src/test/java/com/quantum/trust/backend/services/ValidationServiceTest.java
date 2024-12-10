package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.model.entities.User;

public class ValidationServiceTest {

    @Mock
    private CryptoService cryptoService;

    @Mock
    private TransactionService transactionService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ValidationService validationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        validationService = new ValidationService(cryptoService, transactionService, objectMapper);
    }

    @Test
    public void testValidateUserObject() throws Exception {
        User user = new User();
        user.setEmailAddress("encryptedEmail");
        user.setPhoneNumber("encryptedPhone");
        user.setFirstName("encryptedFirstName");
        user.setLastName("encryptedLastName");
        user.setPeselNumber("encryptedPesel");
        user.setDocumentType("encryptedDocumentType");
        user.setDocumentSerie("encryptedDocumentSerie");
        user.setAddress("encryptedAddress");
        user.setPassword("ValidPassword123!");
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("test@example.com");
        when(cryptoService.decryptData("encryptedPhone")).thenReturn("+1234567890");
        when(cryptoService.decryptData("encryptedFirstName")).thenReturn("John");
        when(cryptoService.decryptData("encryptedLastName")).thenReturn("Doe");
        when(cryptoService.decryptData("encryptedPesel")).thenReturn("12345678901");
        when(cryptoService.decryptData("encryptedDocumentType")).thenReturn("Dowód Osobisty");
        when(cryptoService.decryptData("encryptedDocumentSerie")).thenReturn("ABC 123456");
        when(cryptoService.decryptData("encryptedAddress")).thenReturn("Main Street 1, City");
        validationService.validateUserObject(user);
    }

    @Test
    public void testValidateEditedUserObject() throws Exception {
        User user = new User();
        user.setEmailAddress("encryptedEmail");
        user.setPhoneNumber("encryptedPhone");
        user.setFirstName("encryptedFirstName");
        user.setLastName("encryptedLastName");
        user.setAddress("encryptedAddress");
        when(cryptoService.decryptData("encryptedEmail")).thenReturn("test@example.com");
        when(cryptoService.decryptData("encryptedPhone")).thenReturn("+1234567890");
        when(cryptoService.decryptData("encryptedFirstName")).thenReturn("John");
        when(cryptoService.decryptData("encryptedLastName")).thenReturn("Doe");
        when(cryptoService.decryptData("encryptedAddress")).thenReturn("Main Street 1, City");
        validationService.validateEditedUserObject(user);
    }

    @Test
    public void testValidateLoginUserObject() throws Exception {
        User user = new User();
        user.setId(1000001L);
        user.setPassword("encryptedPassword");
        when(cryptoService.decryptData("encryptedPassword")).thenReturn("ValidPassword123!");
        validationService.validateLoginUserObject(user);
    }

    @Test
    public void testValidateAccountObject() {
        Account account = new Account();
        account.setType("personal");
        account.setCurrency("PLN");
        account.setBalance(0.00f);
        account.setImage("first-account.webp");
        validationService.validateAccountObject(account);
    }

    @Test
    public void testValidateDeposit() {
        Deposit deposit = new Deposit();
        deposit.setBalance(500.0f);
        deposit.setType("timely");
        deposit.setPercent(3.0f);
        deposit.setDuration(2);
        deposit.setEndDate("2024-12-31");
        when(transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 100)).thenReturn(100.0f);
        when(transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 10000)).thenReturn(10000.0f);
        assertThrows(Exception.class, () -> validationService.validateDeposit(deposit));
    }

    @Test
    public void testValidateImage() throws Exception {
        validationService.validateImage("test.png", 1024 * 1024);
    }

    @Test
    public void testValidateOperation() {
        validationService.validateOperation("otworzenie nowego konta bankowego");
    }

    @Test
    public void testValidateEmail() {
        assertTrue(validationService.validateEmail("test@example.com"));
    }

    @Test
    public void testValidateTransferTitle() {
        assertTrue(validationService.validateTransferTitle("Valid Transfer Title"));
    }

    @Test
    public void testValidateTransferAmount() {
        Account senderAccount = new Account();
        senderAccount.setBalance(1000.0f);
        assertTrue(validationService.validateTransferAmount(500.0f, senderAccount));
    }

    @Test
    public void testValidatePassword() {
        assertTrue(validationService.validatePassword("ValidPassword123!"));
    }
}