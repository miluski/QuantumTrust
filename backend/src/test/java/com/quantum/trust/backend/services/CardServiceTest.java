package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.CardMapper;
import com.quantum.trust.backend.model.Fees;
import com.quantum.trust.backend.model.dto.CardDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.CardRepository;

class CardServiceTest {

    @Mock
    private AccountService accountService;

    @Mock
    private CryptoService cryptoService;

    @Mock
    private ValidationService validationService;

    @Mock
    private TransactionService transactionService;

    @Mock
    private CardMapper cardMapper;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private CardService cardService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckCardsFees_ShouldChargeMonthlyFee() throws Exception {
        Account account = new Account();
        account.setBalance(1000f);
        Card card = new Card();
        card.setId("1");
        card.setAccount(account);
        card.setCreationDate(LocalDate.now().minusMonths(1));
        card.setFees("encryptedFeesString");
        Fees fees = new Fees(10f, 10f);
        when(cardRepository.findAll()).thenReturn(List.of(card));
        when(cryptoService.decryptData("encryptedFeesString")).thenReturn("{\"monthly\":10,\"release\":10}");
        when(objectMapper.readValue(anyString(), eq(Fees.class))).thenReturn(fees);
        cardService.checkCardsFees();
        verify(accountRepository, times(1)).save(account);
        assertEquals(990f, account.getBalance());
    }

    @Test
    void testCheckCardsFees_ShouldDeleteCardWhenInsufficientFunds() throws Exception {
        Card card = new Card();
        Account account = new Account();
        account.setBalance(5f);
        card.setAccount(account);
        card.setCreationDate(LocalDate.now().minusMonths(1));
        card.setFees("encryptedFeesString");
        Fees fees = new Fees(10f, 10f);
        when(cardRepository.findAll()).thenReturn(List.of(card));
        when(cryptoService.decryptData(anyString())).thenReturn("{\"monthly\":10,\"release\":10}");
        when(objectMapper.readValue(anyString(), eq(Fees.class))).thenReturn(fees);
        cardService.checkCardsFees();
        verify(cardRepository, times(1)).delete(card);
    }

    @Test
    void testOrderNewCard_ShouldSaveCard() throws Exception {
        String encryptedCardDto = "encryptedData";
        String decryptedCardDto = "{\"assignedAccountNumber\":\"1\"}";
        Card card = new Card();
        card.setFees("encryptedFeesString");
        card.setId("1");
        CardDto cardDto = new CardDto();
        cardDto.setAssignedAccountNumber("1");
        Account account = new Account();
        account.setBalance(1000f);
        Fees fees = new Fees(10f, 10f);
        when(cryptoService.decryptData("encryptedFeesString")).thenReturn("{\"monthly\":10,\"release\":10}");
        when(cryptoService.decryptData(anyString())).thenReturn(decryptedCardDto);
        when(objectMapper.readValue(decryptedCardDto, CardDto.class)).thenReturn(cardDto);
        when(accountRepository.findById(anyString())).thenReturn(Optional.of(account));
        when(cardMapper.convertToCard(any())).thenReturn(card);
        when(objectMapper.readValue(anyString(), eq(Fees.class))).thenReturn(fees);
        ResponseEntity<?> response = cardService.orderNewCard(encryptedCardDto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(cardRepository, times(1)).save(card);
    }

    @Test
    void testSuspendCard_ShouldChangeStatusToSuspended() throws Exception {
        Card card = new Card();
        when(cryptoService.decryptData(anyString())).thenReturn("1");
        when(cardRepository.findById(anyLong())).thenReturn(Optional.of(card));
        ResponseEntity<?> response = cardService.suspendCard("encryptedId");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("suspended", card.getStatus());
        verify(cardRepository, times(1)).save(card);
    }

    @Test
    void testUnsuspendCard_ShouldChangeStatusToUnsuspended() throws Exception {
        Card card = new Card();
        when(cryptoService.decryptData(anyString())).thenReturn("1");
        when(cardRepository.findById(anyLong())).thenReturn(Optional.of(card));
        ResponseEntity<?> response = cardService.unsuspendCard("encryptedId");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("unsuspended", card.getStatus());
        verify(cardRepository, times(1)).save(card);
    }

    @Test
    void testEditCard_ShouldThrowErrorWhenAccountIsNotFound() throws Exception {
        String encryptedCardObject = "encryptedCardObject";
        String decryptedCardObject = "{\"id\":\"1\"}";
        CardDto cardDto = new CardDto();
        cardDto.setId("1");
        Card card = new Card();
        card.setId("1");
        when(cryptoService.decryptData(encryptedCardObject)).thenReturn(decryptedCardObject);
        when(objectMapper.readValue(decryptedCardObject, CardDto.class)).thenReturn(cardDto);
        when(cardRepository.findById(anyLong())).thenReturn(Optional.of(card));
        ResponseEntity<?> response = cardService.editCard(encryptedCardObject);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}