package com.quantum.trust.backend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.DepositMapper;
import com.quantum.trust.backend.model.dto.DepositDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.DepositRepository;

import jakarta.servlet.http.HttpServletRequest;

public class DepositServiceTest {

    @Mock
    private AccountService accountService;

    @Mock
    private CryptoService cryptoService;

    @Mock
    private ValidationService validationService;

    @Mock
    private DepositMapper depositMapper;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private TransactionService transactionService;

    @Mock
    private DepositRepository depositRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private DepositService depositService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCheckDeposits() throws Exception {
        Deposit deposit = new Deposit();
        deposit.setEndDate(LocalDate.now().toString());
        deposit.setBalance(1.0f);
        deposit.setPercent(3.5f);
        deposit.setDuration(3);
        deposit.setType("timely");
        Account account = new Account();
        account.setBalance(20.0f);
        deposit.setAccount(account);
        when(depositRepository.findAll()).thenReturn(Arrays.asList(deposit));
        depositService.checkDeposits();
        verify(depositRepository, times(1)).findAll();
        verify(depositRepository, times(1)).delete(deposit);
    }

    @Test
    public void testSaveNewDeposit_ShouldThrowExceptionWhenAccountNotFound() throws Exception {
        String encryptedDepositDto = "encryptedData";
        Deposit deposit = new Deposit();
        DepositService depositService = Mockito.mock(DepositService.class);
        when(cryptoService.decryptData(encryptedDepositDto)).thenReturn("decryptedData");
        when(objectMapper.readValue("decryptedData", DepositDto.class)).thenReturn(new DepositDto());
        when(depositMapper.convertToDeposit(any(DepositDto.class))).thenReturn(deposit);
        doThrow(new Exception("Account not founded")).when(depositService).assignAccountToDeposit(any(Deposit.class),
                any(DepositDto.class));
        verify(depositRepository, times(0)).save(deposit);
    }

    @Test
    public void testGetAllUserDeposits() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        Account account = new Account();
        when(accountService.retrieveAccountsFromUserId(request)).thenReturn(Arrays.asList(account));
        when(depositRepository.findAllDepositsByAccount(account)).thenReturn(Arrays.asList(new Deposit()));
        ResponseEntity<?> response = depositService.getAllUserDeposits(request);
        verify(accountService, times(1)).retrieveAccountsFromUserId(request);
        assert (response.getStatusCode() == HttpStatus.OK);
    }

    @Test
    public void testCalculateInterest() {
        Deposit deposit = new Deposit();
        deposit.setBalance(1000f);
        deposit.setPercent(5f);
        deposit.setDuration(12);
        deposit.setType("non-progressive");
        float interest = depositService.calculateInterest(deposit);
        assert (interest > 0);
    }
}