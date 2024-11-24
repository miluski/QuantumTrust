package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.AccountService;
import com.quantum.trust.backend.services.TransactionService;
import com.quantum.trust.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final AccountService accountService;
    private final TransactionService transactionService;

    @Autowired
    public UserController(UserService userService, AccountService accountService,
            TransactionService transactionService) {
        this.userService = userService;
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    @GetMapping("/id")
    public ResponseEntity<?> findUserWithId(@RequestParam String id) {
        return this.userService.isIdentifierExists(id);
    }

    @GetMapping("/email")
    public ResponseEntity<?> findUserWithEmail(@RequestParam String email) {
        boolean isUserExists = this.userService.isEmailExists(email);
        return isUserExists ? ResponseEntity.status(HttpStatus.OK).build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/account-object")
    public ResponseEntity<?> getUserAccountObject(HttpServletRequest httpServletRequest) {
        return this.userService.getUserAccountObject(httpServletRequest);
    }

    @GetMapping("/all-accounts")
    public ResponseEntity<?> getAllUserAccounts(HttpServletRequest httpServletRequest) {
        return this.accountService.getAllAccountsFromUserId(httpServletRequest);
    }

    @GetMapping("/all-transactions")
    public ResponseEntity<?> getAllUserTransactions(HttpServletRequest httpServletRequest) {
        return this.transactionService.getAllUserTransactions(httpServletRequest);
    }

    @PostMapping("/account/open")
    public ResponseEntity<?> openNewAccount(@RequestBody String encryptedAccountDto) {
        return this.userService.saveNewBankAccount(encryptedAccountDto);
    }
}
