package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quantum.trust.backend.mappers.TransactionMapper;
import com.quantum.trust.backend.model.TransactionCredentials;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.model.entities.Transaction;
import com.quantum.trust.backend.repositories.TransactionRepository;

import jakarta.servlet.http.HttpServletRequest;

public class TransactionServiceTest {

    @Mock
    private CardService cardService;

    @Mock
    private CryptoService cryptoService;

    @Mock
    private AccountService accountService;

    @Mock
    private TransactionMapper transactionMapper;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCheckTransactionStatuses() {
        Transaction transaction = new Transaction();
        transaction.setDate(LocalDate.now().minusDays(3).toString());
        transaction.setStatus("blockade");
        when(transactionRepository.findAll()).thenReturn(Collections.singletonList(transaction));
        transactionService.checkTransactionStatuses();
        assertEquals("blockade", transaction.getStatus());
    }

    @Test
    public void testGetAllUserTransactions() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        Account account = new Account();
        Card card = new Card();
        when(accountService.retrieveAccountsFromUserId(request)).thenReturn(Collections.singletonList(account));
        when(cardService.getAllUserCards(request)).thenReturn(Collections.singletonList(card));
        when(transactionRepository.findAllTransactionsByAccount(any(Account.class)))
                .thenReturn(Collections.emptyList());
        when(transactionRepository.findAllTransactionsByCard(any(Card.class))).thenReturn(Collections.emptyList());
        when(cryptoService.encryptData(any())).thenReturn("encryptedData");
        ResponseEntity<?> response = transactionService.getAllUserTransactions(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testSaveNewTransaction() {
        TransactionDto transactionDto = new TransactionDto(null, null, null, null, null, null, null, null, null, null,
                null, null, null, null);
        Transaction transaction = new Transaction();
        when(transactionMapper.convertToTransaction(transactionDto)).thenReturn(transaction);
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        boolean result = transactionService.saveNewTransaction(transactionDto);
        assertTrue(result);
        verify(transactionRepository, times(1)).save(transaction);
    }

    @Test
    public void testGetTransactionDto() {
        Account account = new Account();
        account.setCurrency("USD");
        TransactionCredentials credentials = new TransactionCredentials(100.0f, 50.0f, "Food", "completed", "Grocery",
                "debit");
        TransactionDto transactionDto = transactionService.getTransactionDto(account, credentials);
        assertEquals("USD", transactionDto.getAccountCurrency());
        assertEquals(100.0f, transactionDto.getAccountAmountAfter());
        assertEquals(50.0f, transactionDto.getAmount());
        assertEquals("Food", transactionDto.getCategory());
        assertEquals("completed", transactionDto.getStatus());
        assertEquals("Grocery", transactionDto.getTitle());
        assertEquals("debit", transactionDto.getType());
    }

    @Test
    public void testGetRecalculatedAmount() {
        float amount = transactionService.getRecalculatedAmount("USD", "EUR", 100.0f);
        assertEquals(100.0f * 3.8659f / 4.2883f, amount, 0.00001f);
    }
}