package com.quantum.trust.backend.services;

import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.AccountMapper;
import com.quantum.trust.backend.mappers.UserMapper;
import com.quantum.trust.backend.model.TransactionCredentials;
import com.quantum.trust.backend.model.dto.AccountDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @service UserService
 * @description Service class for managing user-related operations.
 *
 * @class UserService
 *
 * @constructor
 *              Initializes the UserService with the specified services and
 *              repositories.
 * @param {UserMapper}            userMapper - The mapper for converting user
 *                                entities to DTOs.
 * @param {AccountMapper}         accountMapper - The mapper for converting
 *                                account entities to DTOs.
 * @param {TokenService}          tokenService - The service for handling
 *                                tokens.
 * @param {CookieService}         cookieService - The service for handling
 *                                cookies.
 * @param {CryptoService}         cryptoService - The service for handling
 *                                encryption and decryption.
 * @param {EmailService}          emailService - The service for sending emails.
 * @param {MediaService}          mediaService - The service for handling media
 *                                files.
 * @param {ValidationService}     validationService - The service for validating
 *                                entities.
 * @param {TransactionService}    transactionService - The service for handling
 *                                transactions.
 * @param {ObjectMapper}          objectMapper - The object mapper for JSON
 *                                processing.
 * @param {UserRepository}        userRepository - The repository for accessing
 *                                user data.
 * @param {AccountRepository}     accountRepository - The repository for
 *                                accessing account data.
 * @param {AuthenticationManager} authenticationManager - The manager for
 *                                handling authentication.
 *
 * @method registerNewAccount - Registers a new user account and bank account.
 * @param {String} encryptedUserDto - The encrypted user DTO.
 * @param {String} encryptedAccountDto - The encrypted account DTO.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method createUserAccount - Creates a new user account.
 * @param {String} encryptedUserDto - The encrypted user DTO.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method saveNewBankAccount - Saves a new bank account.
 * @param {String} encryptedAccountDto - The encrypted account DTO.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method saveNewBankAccount - Saves a new bank account for a logged-in user.
 * @param {HttpServletRequest} httpServletRequest - The HTTP servlet request.
 * @param {String}             encryptedAccountDto - The encrypted account DTO.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method getUserAccountObject - Retrieves the user account object.
 * @param {HttpServletRequest} httpServletRequest - The HTTP servlet request.
 * @returns {ResponseEntity<?>} - The response entity with the user account
 *          object.
 *
 * @method login - Logs in a user.
 * @param {String}              encryptedUserDto - The encrypted user DTO.
 * @param {HttpServletResponse} httpServletResponse - The HTTP servlet response.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method removeTokens - Removes the tokens from the response.
 * @param {HttpServletRequest}  httpServletRequest - The HTTP servlet request.
 * @param {HttpServletResponse} httpServletResponse - The HTTP servlet response.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method isEmailExists - Checks if an email exists.
 * @param {String} encryptedEmail - The encrypted email.
 * @returns {boolean} - True if the email exists, false otherwise.
 *
 * @method isIdentifierExists - Checks if an identifier exists.
 * @param {String} encryptedId - The encrypted identifier.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method refreshToken - Refreshes the tokens.
 * @param {HttpServletRequest}  httpServletRequest - The HTTP servlet request.
 * @param {HttpServletResponse} httpServletResponse - The HTTP servlet response.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method getIsAccountExists - Checks if an account exists.
 * @param {String} encryptedAccountNumber - The encrypted account number.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method sendNewTransfer - Sends a new transfer.
 * @param {String} encryptedTransferDto - The encrypted transfer DTO.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method editUserAccount - Edits a user account.
 * @param {String}             encryptedUserObject - The encrypted user object.
 * @param {HttpServletRequest} httpServletRequest - The HTTP servlet request.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 * 
 * @method setEditedUserCredentials - Sets the edited user credentials.
 * @param {User}    user - The user entity.
 * @param {UserDto} userDto - The user DTO.
 *
 * @method setNewUserPassword - Sets the new user password.
 * @param {User}    user - The user entity.
 * @param {UserDto} userDto - The user DTO.
 * @throws {Exception} - If the password is invalid.
 *
 * @method setNewUserAvatar - Sets the new user avatar.
 * @param {User}    user - The user entity.
 * @param {UserDto} userDto - The user DTO.
 * @throws {Exception} - If the avatar path is invalid.
 *
 * @method getUserAccountObject - Retrieves the user account object.
 * @param {String} accountNumber - The account number.
 * @returns {Account} - The account entity.
 * @throws {Exception} - If the account does not exist.
 *
 * @method validateTransferCredentials - Validates the transfer credentials.
 * @param {String}  transferTitle - The transfer title.
 * @param {Float}   transferAmount - The transfer amount.
 * @param {Account} senderAccount - The sender's account.
 * @throws {Exception} - If the transfer credentials are invalid.
 *
 * @method updateSenderAccountBalance - Updates the sender's account balance.
 * @param {Account} account - The account entity.
 * @param {String}  transferTitle - The transfer title.
 * @param {Float}   transferAmount - The transfer amount.
 * @throws {Exception} - If the update fails.
 *
 * @method updateReceiverAccountBalance - Updates the receiver's account
 *         balance.
 * @param {Account} receiverAccount - The receiver's account.
 * @param {Account} senderAccount - The sender's account.
 * @param {String}  transferTitle - The transfer title.
 * @param {Float}   transferAmount - The transfer amount.
 * @throws {Exception} - If the update fails.
 * 
 * @method saveTransaction - Saves a transaction.
 * @param {Account} account - The account entity.
 * @param {String}  transactionType - The transaction type.
 * @param {String}  transactionTitle - The transaction title.
 * @param {Float}   transactionAmount - The transaction amount.
 * @throws {Exception} - If the transaction save fails.
 *
 * @method getUserAccountObject - Retrieves the user account object.
 * @param {String}  encryptedAccountDto - The encrypted account DTO.
 * @param {boolean} isForLoggedUser - Flag indicating if the account is for a
 *                  logged-in user.
 * @returns {Account} - The account entity.
 * @throws {Exception} - If the account retrieval fails.
 *
 * @method getUserDto - Retrieves the user DTO.
 * @param {String} encryptedUserDto - The encrypted user DTO.
 * @returns {UserDto} - The user DTO.
 *
 * @method getUserFromToken - Retrieves the user from the token.
 * @param {HttpServletRequest} httpServletRequest - The HTTP servlet request.
 * @returns {User} - The user entity.
 * @throws {Exception} - If the user retrieval fails.
 *
 * @method newTokensPair - Generates a new pair of tokens.
 * @param {String}              refreshToken - The refresh token.
 * @param {HttpServletResponse} httpServletResponse - The HTTP servlet response.
 * @returns {ResponseEntity<?>} - The response entity with the status of the
 *          operation.
 *
 * @method getIsIdentifierFromTokenExists - Checks if the identifier from the
 *         token exists.
 * @param {String} identificatorFromToken - The identifier from the token.
 * @returns {boolean} - True if the identifier exists, false otherwise.
 *
 * @method addTokensToResponse - Adds tokens to the response.
 * @param {HttpServletResponse} httpServletResponse - The HTTP servlet response.
 * @param {String}              userId - The user ID.
 *
 * @method deleteUserAccount - Deletes the user account.
 *
 * @method deleteUserBankAccount - Deletes the user bank account.
 */
@Service
public class UserService {
    private User savedUserAccount;
    private Account savedUserBankAccount;

    private final UserMapper userMapper;
    private final AccountMapper accountMapper;
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final CryptoService cryptoService;
    private final EmailService emailService;
    private final MediaService mediaService;
    private final ValidationService validationService;
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserMapper userMapper,
            AccountMapper accountMapper, TokenService tokenService, CookieService cookieService,
            CryptoService cryptoService,
            EmailService emailService,
            MediaService mediaService,
            ValidationService validationService, TransactionService transactionService,
            ObjectMapper objectMapper,
            UserRepository userRepository, AccountRepository accountRepository,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.accountMapper = accountMapper;
        this.cryptoService = cryptoService;
        this.objectMapper = objectMapper;
        this.emailService = emailService;
        this.mediaService = mediaService;
        this.validationService = validationService;
        this.transactionService = transactionService;
        this.cookieService = cookieService;
    }

    public ResponseEntity<?> registerNewAccount(String encryptedUserDto, String encryptedAccountDto) {
        ResponseEntity<?> accountResponse = this.createUserAccount(encryptedUserDto);
        boolean isAccountProperlySaved = accountResponse.getStatusCode().equals(HttpStatus.OK);
        return isAccountProperlySaved ? this.saveNewBankAccount(encryptedAccountDto) : accountResponse;
    }

    public ResponseEntity<?> createUserAccount(String encryptedUserDto) {
        try {
            User user = this.userMapper.convertToUser(this.getUserDto(encryptedUserDto));
            user.setPassword(this.cryptoService.decryptData(user.getPassword()));
            this.validationService.validateUserObject(user);
            user.setPassword(this.cryptoService.getEncryptedPassword(user.getPassword()));
            this.savedUserAccount = this.userRepository.save(user);
            this.emailService.sendIdentificator(user);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            this.deleteUserAccount();
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> saveNewBankAccount(String encryptedAccountDto) {
        try {
            Account account = this.getUserAccountObject(encryptedAccountDto, false);
            this.savedUserBankAccount = this.accountRepository.save(account);
            Float accountAmount = this.transactionService.getRecalculatedAmount("PLN",
                    account.getCurrency(), 1000.0f);
            TransactionCredentials transactionCredentials = new TransactionCredentials(accountAmount, accountAmount,
                    "Inne", "settled", "Założenie nowego konta bankowego.", "incoming");
            TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
            this.transactionService.saveNewTransaction(transactionDto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            this.deleteUserAccount();
            this.deleteUserBankAccount();
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> saveNewBankAccount(HttpServletRequest httpServletRequest, String encryptedAccountDto) {
        try {
            String token = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
            String identificatorFromToken = this.tokenService.getIdentificatorFromToken(token);
            Optional<User> user = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            if (user.isEmpty()) {
                throw new Exception("User not found");
            }
            this.savedUserAccount = user.get();
            Account account = this.getUserAccountObject(encryptedAccountDto, true);
            this.validationService.validateAccountObject(account);
            this.savedUserBankAccount = this.accountRepository.save(account);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getUserAccountObject(HttpServletRequest httpServletRequest) {
        try {
            String accessToken = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
            String identificatorFromToken = this.tokenService.getIdentificatorFromToken(accessToken);
            Optional<User> retrievedUser = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            if (retrievedUser.isPresent()) {
                UserDto userDto = this.userMapper.convertToUserDto(retrievedUser.get());
                String encryptedUserObject = this.cryptoService.encryptData(userDto);
                EncryptedDto encryptedDto = new EncryptedDto();
                encryptedDto.setEncryptedData(encryptedUserObject);
                return ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> login(String encryptedUserDto, HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedUserDto);
            String loginData = jsonNode.get("loginData").asText();
            User user = this.userMapper.convertToUser(this.getUserDto(loginData));
            this.validationService.validateLoginUserObject(user);
            user.setPassword(this.cryptoService.decryptData(user.getPassword()));
            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getId(), user.getPassword());
            this.authenticationManager.authenticate(authentication);
            this.addTokensToResponse(httpServletResponse, user.getId().toString());
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public ResponseEntity<?> removeTokens(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        String refreshToken = this.cookieService.getCookieValue(httpServletRequest, "REFRESH_TOKEN");
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(refreshToken);
        String accessToken = this.tokenService.generateToken(identificatorFromToken, "access");
        String newRefreshToken = this.tokenService.generateToken(identificatorFromToken, "refresh");
        Cookie accessTokenCookie = this.cookieService.generateCookie("ACCESS_TOKEN", accessToken, true, 0);
        Cookie refreshTokenCookie = this.cookieService.generateCookie("REFRESH_TOKEN", newRefreshToken, true, 0);
        httpServletResponse.addCookie(accessTokenCookie);
        httpServletResponse.addCookie(refreshTokenCookie);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public boolean isEmailExists(String encryptedEmail) {
        try {
            String userEmail = this.cryptoService.decryptData(encryptedEmail);
            User user = this.userRepository.findByEmailAddress(userEmail);
            return true && user != null;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public ResponseEntity<?> isIdentifierExists(String encryptedId) {
        try {
            String decryptedId = this.cryptoService.decryptData(encryptedId);
            Optional<User> user = this.userRepository.findById(Long.valueOf(decryptedId));
            return user.isPresent() ? ResponseEntity.status(HttpStatus.OK).build()
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> refreshToken(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        String refreshToken = this.cookieService.getCookieValue(httpServletRequest, "REFRESH_TOKEN");
        return refreshToken != null ? this.newTokensPair(refreshToken, httpServletResponse)
                : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    public ResponseEntity<?> getIsAccountExists(String encryptedAccountNumber) {
        try {
            String accountNumber = this.cryptoService.decryptData(encryptedAccountNumber);
            Optional<Account> account = this.accountRepository.findById(accountNumber);
            return account.isPresent() ? ResponseEntity.status(HttpStatus.OK).build()
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> sendNewTransfer(String encryptedTransferDto) {
        try {
            String decryptedTransferDto = this.cryptoService.decryptData(encryptedTransferDto);
            decryptedTransferDto = decryptedTransferDto.replace("\\", "\"");
            JsonNode jsonNode = this.objectMapper.readTree(decryptedTransferDto);
            String senderAccountNumber = jsonNode.get("senderAccountNumber").asText();
            String receiverAccountNumber = jsonNode.get("receiverAccountNumber").asText();
            String transferTitle = jsonNode.get("transferTitle").asText();
            Float transferAmount = Float.valueOf(jsonNode.get("transferAmount").asText());
            Account senderAccount = this.getUserAccountObject(senderAccountNumber);
            Account receiverAccount = this.getUserAccountObject(receiverAccountNumber);
            this.validateTransferCredentials(transferTitle, transferAmount, senderAccount);
            this.updateSenderAccountBalance(senderAccount, transferTitle, transferAmount);
            this.updateReceiverAccountBalance(receiverAccount, senderAccount, transferTitle, transferAmount);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> editUserAccount(String encryptedUserObject, HttpServletRequest httpServletRequest) {
        try {
            UserDto userDto = this.getUserDto(encryptedUserObject);
            User user = this.getUserFromToken(httpServletRequest);
            this.setEditedUserCredentials(user, userDto);
            this.setNewUserPassword(user, userDto);
            this.setNewUserAvatar(user, userDto);
            this.validationService.validateEditedUserObject(user);
            this.userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private void setEditedUserCredentials(User user, UserDto userDto) {
        user.setEmailAddress(userDto.getEmailAddress());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setAddress(userDto.getAddress());
    }

    private void setNewUserPassword(User user, UserDto userDto) throws Exception {
        String decryptedPassword = this.cryptoService.decryptData(userDto.getPassword());
        boolean isDecryptedPasswordEqualsNull = "null".equals(decryptedPassword);
        boolean isDecryptedPasswordObjectNull = Objects.isNull(decryptedPassword);
        boolean isDecryptedPasswordEqualsEmptyString = "".equals(decryptedPassword);
        boolean isDecryptedPasswordEmpty = decryptedPassword.isEmpty();
        boolean isDecryptedPasswordNull = isDecryptedPasswordEqualsNull || isDecryptedPasswordObjectNull
                || isDecryptedPasswordEqualsEmptyString || isDecryptedPasswordEmpty;
        if (!isDecryptedPasswordNull) {
            boolean isPasswordValid = this.validationService.validatePassword(decryptedPassword);
            if (!isPasswordValid) {
                throw new Exception("Invalid user object.");
            }
            user.setPassword(cryptoService.getEncryptedPassword(decryptedPassword));
        }
    }

    private void setNewUserAvatar(User user, UserDto userDto) throws Exception {
        String avatarPath = this.cryptoService.decryptData(userDto.getAvatarPath());
        boolean isAvatarPathEqualsNull = "null".equals(avatarPath);
        boolean isAvatarPathObjectNull = Objects.isNull(avatarPath);
        boolean isAvatarPathEqualsEmptyString = "".equals(avatarPath);
        boolean isAvatarPathEmpty = avatarPath.isEmpty();
        boolean isAvatarPathNull = isAvatarPathEqualsNull || isAvatarPathObjectNull || isAvatarPathEqualsEmptyString
                || isAvatarPathEmpty;
        boolean isAvatarPathChanged = true;
        if (user.getAvatarPath() != null) {
            String decryptedUserPath = this.cryptoService.decryptData(user.getAvatarPath());
            isAvatarPathChanged = !avatarPath.contains(decryptedUserPath);
        }
        if (!isAvatarPathNull && isAvatarPathChanged) {
            String decryptedAvatarPath = this.cryptoService.decryptData(userDto.getAvatarPath());
            this.mediaService.saveImage(user, decryptedAvatarPath);
        }
    }

    private Account getUserAccountObject(String accountNumber) throws Exception {
        Optional<Account> account = this.accountRepository.findById(accountNumber);
        if (account.isEmpty()) {
            throw new Exception("Account not exists");
        }
        return account.get();
    }

    private void validateTransferCredentials(String transferTitle, Float transferAmount, Account senderAccount)
            throws Exception {
        boolean isTransferTitleValid = this.validationService.validateTransferTitle(transferTitle);
        boolean isTransferAmountValid = this.validationService.validateTransferAmount(transferAmount, senderAccount);
        if (isTransferTitleValid == false || isTransferAmountValid == false) {
            throw new Exception("Trasfer credentials is invalid");
        }
    }

    private void updateSenderAccountBalance(Account account, String transferTitle, Float transferAmount)
            throws Exception {
        Float newAccountBalance = account.getBalance() - transferAmount;
        String transactionType = "outgoing";
        account.setBalance(newAccountBalance);
        this.saveTransaction(account, transactionType, transferTitle, transferAmount);
        this.accountRepository.save(account);
    }

    private void updateReceiverAccountBalance(Account receiverAccount, Account senderAccount, String transferTitle,
            Float transferAmount)
            throws Exception {
        transferAmount = this.transactionService.getRecalculatedAmount(senderAccount.getCurrency(),
                receiverAccount.getCurrency(), transferAmount);
        Float newAccountBalance = receiverAccount.getBalance() + transferAmount;
        String transactionType = "incoming";
        receiverAccount.setBalance(newAccountBalance);
        this.saveTransaction(receiverAccount, transactionType, transferTitle, transferAmount);
        this.accountRepository.save(receiverAccount);
    }

    private void saveTransaction(Account account, String transactionType, String transactionTitle,
            Float transactionAmount) throws Exception {
        TransactionCredentials transactionCredentials = new TransactionCredentials(account.getBalance(),
                transactionAmount, "Inne", "blockade", transactionTitle, transactionType);
        TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
        this.transactionService.saveNewTransaction(transactionDto);
    }

    private Account getUserAccountObject(String encryptedAccountDto, boolean isForLoggedUser) throws Exception {
        String decryptedAccountDto = this.cryptoService.decryptData(encryptedAccountDto);
        decryptedAccountDto = decryptedAccountDto.replace("\\", "\"");
        AccountDto accountDto = objectMapper.readValue(decryptedAccountDto, AccountDto.class);
        Account account = this.accountMapper.convertToAccount(accountDto);
        account.setUser(this.savedUserAccount);
        this.validationService.validateAccountObject(account);
        if (isForLoggedUser == false) {
            account.setBalance(this.transactionService.getRecalculatedAmount(
                    "PLN", account.getCurrency(), 1000.0f));
        }
        return account;
    }

    private UserDto getUserDto(String encryptedUserDto) {
        try {
            String decryptedUserDto = this.cryptoService.decryptData(encryptedUserDto);
            decryptedUserDto = decryptedUserDto.replace("\\", "\"");
            return objectMapper.readValue(decryptedUserDto, UserDto.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private User getUserFromToken(HttpServletRequest httpServletRequest) throws Exception {
        String accessToken = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(accessToken);
        Optional<User> retrievedUser = this.userRepository.findById(Long.valueOf(identificatorFromToken));
        if (retrievedUser.isEmpty()) {
            throw new Exception("User was not found.");
        }
        return retrievedUser.get();
    }

    private ResponseEntity<?> newTokensPair(String refreshToken, HttpServletResponse httpServletResponse) {
        String identificatorFromToken = this.tokenService.getIdentificatorFromToken(refreshToken);
        boolean isIdentifierFromTokenValid = this.getIsIdentifierFromTokenExists(identificatorFromToken);
        boolean isRefreshTokenValid = this.tokenService.validateToken(refreshToken, identificatorFromToken);
        if (isIdentifierFromTokenValid && isRefreshTokenValid) {
            this.addTokensToResponse(httpServletResponse, identificatorFromToken);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    private boolean getIsIdentifierFromTokenExists(String identificatorFromToken) {
        try {
            Optional<User> userFromToken = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            return userFromToken.isPresent();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void addTokensToResponse(HttpServletResponse httpServletResponse, String userId) {
        String accessToken = this.tokenService.generateToken(userId, "access");
        String refreshToken = this.tokenService.generateToken(userId, "refresh");
        Cookie accessTokenCookie = this.cookieService.generateCookie("ACCESS_TOKEN", accessToken, true, 60);
        Cookie refreshTokenCookie = this.cookieService.generateCookie("REFRESH_TOKEN", refreshToken, true, 300);
        httpServletResponse.addCookie(accessTokenCookie);
        httpServletResponse.addCookie(refreshTokenCookie);
    }

    private void deleteUserAccount() {
        try {
            this.userRepository.delete(savedUserAccount);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deleteUserBankAccount() {
        try {
            this.accountRepository.delete(savedUserBankAccount);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
