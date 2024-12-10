package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

public class AccountServiceTest {

    @Mock
    private TokenService tokenService;

    @Mock
    private CookieService cookieService;

    @Mock
    private CryptoService cryptoService;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountService accountService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @SuppressWarnings("null")
    @Test
    public void testGetAllAccountsFromUserId_Success() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String accessToken = "testAccessToken";
        String identificatorFromToken = "1";
        User user = new User();
        Account account = new Account();
        AccountDto accountDto = new AccountDto(identificatorFromToken, identificatorFromToken, identificatorFromToken,
                null, identificatorFromToken);
        List<Account> accounts = Arrays.asList(account);
        List<AccountDto> accountDtos = Arrays.asList(accountDto);
        String encryptedData = "encryptedData";

        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(accessToken);
        when(tokenService.getIdentificatorFromToken(accessToken)).thenReturn(identificatorFromToken);
        when(userRepository.findById(Long.valueOf(identificatorFromToken))).thenReturn(Optional.of(user));
        when(accountRepository.findAllAcountsByUser(user)).thenReturn(accounts);
        when(accountMapper.convertToAccountDto(account)).thenReturn(accountDto);
        when(cryptoService.encryptData(accountDtos)).thenReturn(encryptedData);

        ResponseEntity<?> response = accountService.getAllAccountsFromUserId(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof EncryptedDto);
        assertEquals(encryptedData, ((EncryptedDto) response.getBody()).getEncryptedData());
    }

    @Test
    public void testGetAllAccountsFromUserId_NotFound() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String accessToken = "testAccessToken";
        String identificatorFromToken = "1";
        User user = new User();

        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(accessToken);
        when(tokenService.getIdentificatorFromToken(accessToken)).thenReturn(identificatorFromToken);
        when(userRepository.findById(Long.valueOf(identificatorFromToken))).thenReturn(Optional.of(user));
        when(accountRepository.findAllAcountsByUser(user)).thenReturn(Arrays.asList());

        ResponseEntity<?> response = accountService.getAllAccountsFromUserId(request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetAllAccountsFromUserId_InternalServerError() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String accessToken = "testAccessToken";
        String identificatorFromToken = "1";

        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(accessToken);
        when(tokenService.getIdentificatorFromToken(accessToken)).thenReturn(identificatorFromToken);
        when(userRepository.findById(Long.valueOf(identificatorFromToken))).thenThrow(new RuntimeException());

        ResponseEntity<?> response = accountService.getAllAccountsFromUserId(request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testRetrieveAccountsFromUserId_Success() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String accessToken = "testAccessToken";
        String identificatorFromToken = "1";
        User user = new User();
        Account account = new Account();
        List<Account> accounts = Arrays.asList(account);

        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(accessToken);
        when(tokenService.getIdentificatorFromToken(accessToken)).thenReturn(identificatorFromToken);
        when(userRepository.findById(Long.valueOf(identificatorFromToken))).thenReturn(Optional.of(user));
        when(accountRepository.findAllAcountsByUser(user)).thenReturn(accounts);

        List<Account> result = accountService.retrieveAccountsFromUserId(request);

        assertEquals(accounts, result);
    }

    @Test
    public void testRetrieveAccountsFromUserId_UserNotFound() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String accessToken = "testAccessToken";
        String identificatorFromToken = "1";

        when(cookieService.getCookieValue(request, "ACCESS_TOKEN")).thenReturn(accessToken);
        when(tokenService.getIdentificatorFromToken(accessToken)).thenReturn(identificatorFromToken);
        when(userRepository.findById(Long.valueOf(identificatorFromToken))).thenReturn(Optional.empty());

        List<Account> result = accountService.retrieveAccountsFromUserId(request);

        assertNull(result);
    }


}