package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.AccountService;
import com.quantum.trust.backend.services.TransactionService;
import com.quantum.trust.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * @controller UserController
 * @description Controller class for managing user-related operations.
 *
 * @class UserController
 *
 * @constructor
 *              Initializes the UserController with the specified UserService,
 *              AccountService, and TransactionService.
 *
 * @method findUserWithId - Finds a user by their ID.
 * @param {String} id - The ID of the user to find.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating whether the user
 *          exists.
 *
 * @method findUserWithEmail - Finds a user by their email address.
 * @param {String} email - The email address of the user to find.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating whether the user
 *          exists.
 *
 * @method getUserAccountObject - Retrieves the user's account object.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the user's account
 *          object or an error status.
 *
 * @method getAllUserAccounts - Retrieves all accounts for a user.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the user's
 *          accounts or an error status.
 *
 * @method getAllUserTransactions - Retrieves all transactions for a user.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the user's
 *          transactions or an error status.
 *
 * @method getIsAccountExists - Checks if an account exists.
 * @param {String} accountNumber - The account number to check.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating whether the
 *          account exists.
 *
 * @method openNewAccount - Opens a new account.
 * @param {String}             encryptedAccountDto - The encrypted account data
 *                             transfer object.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 *
 * @method sendNewTransfer - Sends a new transfer.
 * @param {String} encryptedTransferDto - The encrypted transfer data transfer
 *                 object.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 *
 * @method editUser - Edits a user's account.
 * @param {String}             encryptedUserObject - The encrypted user object
 *                             containing the updated user information.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 */
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

    @PostMapping("/account")
    public ResponseEntity<?> getIsAccountExists(@RequestParam String accountNumber) {
        return this.userService.getIsAccountExists(accountNumber);
    }

    @PostMapping("/account/open")
    public ResponseEntity<?> openNewAccount(@RequestBody String encryptedAccountDto,
            HttpServletRequest httpServletRequest) {
        return this.userService.saveNewBankAccount(httpServletRequest, encryptedAccountDto);
    }

    @PostMapping("/new-transfer")
    public ResponseEntity<?> sendNewTransfer(@RequestBody String encryptedTransferDto) {
        return this.userService.sendNewTransfer(encryptedTransferDto);
    }

    @PatchMapping("/edit")
    public ResponseEntity<?> editUser(@RequestBody String encryptedUserObject, HttpServletRequest httpServletRequest) {
        return this.userService.editUserAccount(encryptedUserObject, httpServletRequest);
    }
}
