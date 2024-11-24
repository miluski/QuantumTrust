package com.quantum.trust.backend.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AccountService {
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final CryptoService cryptoService;
    private final AccountMapper accountMapper;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public AccountService(TokenService tokenService, CookieService cookieService, CryptoService cryptoService,
            AccountMapper accountMapper,
            UserRepository userRepository, AccountRepository accountRepository) {
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.cryptoService = cryptoService;
        this.accountMapper = accountMapper;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    public ResponseEntity<?> getAllAccountsFromUserId(HttpServletRequest httpServletRequest) {
        try {
            List<AccountDto> accountsList = this.retrieveAccountsFromUserId(httpServletRequest).stream()
                    .map(accountMapper::convertToAccountDto).collect(Collectors.toList());
            String encryptedAccountsList = this.cryptoService.encryptData(accountsList);
            EncryptedDto encryptedDto = new EncryptedDto(encryptedAccountsList);
            return accountsList.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                    : ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public List<Account> retrieveAccountsFromUserId(HttpServletRequest httpServletRequest)
            throws IllegalArgumentException {
        String accessToken = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(accessToken);
        Optional<User> retrievedUser = this.userRepository.findById(Long.valueOf(identificatorFromToken));
        return retrievedUser.isPresent()
                ? this.accountRepository.findAllAcountsByUser(retrievedUser.get())
                : null;
    }
}
