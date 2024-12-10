package com.quantum.trust.backend.services;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @service ValidationService
 * @description Service class for validating various entities and objects.
 *
 * @class ValidationService
 *
 * @constructor
 *              Initializes the ValidationService with the specified services
 *              and initializes the valid fees and limits maps.
 * @param {CryptoService}      cryptoService - The service for handling
 *                             encryption and decryption.
 * @param {TransactionService} transactionService - The service for handling
 *                             transactions.
 * @param {ObjectMapper}       objectMapper - The object mapper for JSON
 *                             processing.
 *
 * @method validateUserObject - Validates a User object.
 * @param {User} user - The User object to validate.
 * @throws {Exception} - If the User object is invalid.
 *
 * @method validateEditedUserObject - Validates an edited User object.
 * @param {User} user - The edited User object to validate.
 * @throws {Exception} - If the edited User object is invalid.
 *
 * @method validateLoginUserObject - Validates a User object for login.
 * @param {User} user - The User object to validate for login.
 * @throws {Exception} - If the User object for login is invalid.
 *
 * @method validateAccountObject - Validates an Account object.
 * @param {Account} account - The Account object to validate.
 * @throws {IllegalArgumentException} - If the Account object is invalid.
 * @method validateDeposit - Validates a Deposit object.
 * @param {Deposit} deposit - The Deposit object to validate.
 * @throws {IllegalArgumentException} - If the Deposit object is invalid.
 *
 * @method validateCard - Validates a Card object.
 * @param {Card} card - The Card object to validate.
 * @throws {Exception} - If the Card object is invalid.
 *
 * @method getRecalculatedReleaseFee - Recalculates the release fee for a card.
 * @param {Card}   card - The Card object.
 * @param {Fees}   cardFees - The Fees object for the card.
 * @param {String} fromCurrency - The currency to convert from.
 * @returns {Integer} - The recalculated release fee.
 *
 * @method getRecalculatedMonthlyFee - Recalculates the monthly fee for a card.
 * @param {Card}   card - The Card object.
 * @param {Fees}   cardFees - The Fees object for the card.
 * @param {String} fromCurrency - The currency to convert from.
 * @returns {Integer} - The recalculated monthly fee.
 *
 * @method validateImage - Validates an image file.
 * @param {String} fileName - The name of the image file.
 * @param {long}   fileSize - The size of the image file.
 * @throws {Exception} - If the image file is invalid.
 *
 * @method validateOperation - Validates an operation.
 * @param {String} operation - The operation to validate.
 * @throws {IllegalArgumentException} - If the operation is invalid.
 *
 * @method validateEmail - Validates an email address.
 * @param {String} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 *
 * @method validateTransferTitle - Validates a transfer title.
 * @param {String} title - The transfer title to validate.
 * @returns {boolean} - True if the transfer title is valid, false otherwise.
 *
 * @method validateTransferAmount - Validates a transfer amount.
 * @param {Float}   transferAmount - The transfer amount to validate.
 * @param {Account} senderAccount - The sender's account.
 * @returns {boolean} - True if the transfer amount is valid, false otherwise.
 *
 * @method validatePassword - Validates a password.
 * @param {String} password - The password to validate.
 * @returns {boolean} - True if the password is valid, false otherwise.
 *
 * @method validateCardType - Validates a card type.
 * @param {String} type - The card type to validate.
 * @returns {boolean} - True if the card type is valid, false otherwise.
 *
 * @method validateCardPublisher - Validates a card publisher.
 * @param {String} publisher - The card publisher to validate.
 * @returns {boolean} - True if the card publisher is valid, false otherwise.
 *
 * @method validateCardFees - Validates the fees for a card.
 * @param {Card} card - The Card object.
 * @returns {boolean} - True if the card fees are valid, false otherwise.
 * @throws {Exception} - If the card fees are invalid.
 *
 * @method validateCardLimits - Validates the limits for a card.
 * @param {Card} card - The Card object.
 * @returns {boolean} - True if the card limits are valid, false otherwise.
 * @throws {Exception} - If the card limits are invalid.
 *
 * @method validateCardExpirationDate - Validates the expiration date for a
 *         card.
 * @param {String} expirationDate - The expiration date to validate.
 * @returns {boolean} - True if the expiration date is valid, false otherwise.
 *
 * @method validateCardPin - Validates the PIN for a card.
 * @param {String} encryptedPin - The encrypted PIN to validate.
 * @returns {boolean} - True if the PIN is valid, false otherwise.
 * @throws {Exception} - If the PIN is invalid.
 *
 * @method validateCardImage - Validates the image for a card.
 * @param {String} image - The image to validate.
 * @returns {boolean} - True if the image is valid, false otherwise.
 * @method validateShowingCardSite - Validates the showing card site.
 * @param {String} cardSite - The showing card site to validate.
 * @returns {boolean} - True if the showing card site is valid, false otherwise.
 *
 * @method validateCardBackImage - Validates the back image for a card.
 * @param {String} backImage - The back image to validate.
 * @returns {boolean} - True if the back image is valid, false otherwise.
 *
 * @method validateCardStatus - Validates the status for a card.
 * @param {String} status - The status to validate.
 * @returns {boolean} - True if the status is valid, false otherwise.
 *
 * @method validateDepositBalance - Validates the balance for a deposit.
 * @param {Deposit} deposit - The Deposit object.
 * @returns {boolean} - True if the deposit balance is valid, false otherwise.
 *
 * @method roundValue - Rounds a float value to the nearest integer.
 * @param {Float} value - The value to round.
 * @returns {Integer} - The rounded value.
 *
 * @method validateDepositType - Validates the type for a deposit.
 * @param {String} type - The type to validate.
 * @returns {boolean} - True if the type is valid, false otherwise.
 *
 * @method validateDepositPercent - Validates the percent for a deposit.
 * @param {Float} percent - The percent to validate.
 * @returns {boolean} - True if the percent is valid, false otherwise.
 *
 * @method validateDuration - Validates the duration for a deposit.
 * @param {Integer} duration - The duration to validate.
 * @returns {boolean} - True if the duration is valid, false otherwise.
 *
 * @method validateEndDate - Validates the end date for a deposit.
 * @param {String} endDate - The end date to validate.
 * @returns {boolean} - True if the end date is valid, false otherwise.
 *
 * @method validatePhoneNumber - Validates a phone number.
 * @param {String} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 * @method validateFirstName - Validates a first name.
 * @param {String} firstName - The first name to validate.
 * @returns {boolean} - True if the first name is valid, false otherwise.
 *
 * @method validateLastName - Validates a last name.
 * @param {String} lastName - The last name to validate.
 * @returns {boolean} - True if the last name is valid, false otherwise.
 *
 * @method validatePESEL - Validates a PESEL number.
 * @param {String} pesel - The PESEL number to validate.
 * @returns {boolean} - True if the PESEL number is valid, false otherwise.
 *
 * @method validateIdentityDocumentType - Validates an identity document type.
 * @param {String} documentType - The document type to validate.
 * @returns {boolean} - True if the document type is valid, false otherwise.
 *
 * @method validateDocument - Validates a document.
 * @param {String} document - The document to validate.
 * @returns {boolean} - True if the document is valid, false otherwise.
 *
 * @method validateAddress - Validates an address.
 * @param {String} address - The address to validate.
 * @returns {boolean} - True if the address is valid, false otherwise.
 *
 * @method validateAccountType - Validates an account type.
 * @param {String} accountType - The account type to validate.
 * @returns {boolean} - True if the account type is valid, false otherwise.
 *
 * @method validateCurrency - Validates a currency.
 * @param {String} currency - The currency to validate.
 * @returns {boolean} - True if the currency is valid, false otherwise.
 *
 * @method validateAccountBalance - Validates an account balance.
 * @param {Float} accountBalance - The account balance to validate.
 * @returns {boolean} - True if the account balance is valid, false otherwise.
 *
 * @method validateAccountImage - Validates an account image.
 * @param {String} accountImage - The account image to validate.
 * @returns {boolean} - True if the account image is valid, false otherwise.
 */
@Service
public class VerificationService {
    private String verificationCode;

    private final ObjectMapper objectMapper;
    private final CryptoService cryptoService;
    private final CookieService cookieService;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final UserService userService;
    private final ValidationService validationService;
    private final UserRepository userRepository;

    @Autowired
    public VerificationService(CryptoService cryptoService, ValidationService validationService,
            ObjectMapper objectMapper, CookieService cookieService, UserService userService,
            EmailService emailService, TokenService tokenService, UserRepository userRepository) {
        this.cryptoService = cryptoService;
        this.validationService = validationService;
        this.objectMapper = objectMapper;
        this.cookieService = cookieService;
        this.userService = userService;
        this.emailService = emailService;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> handleRegisterVerification(String encryptedObject,
            HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedObject);
            String encryptedEmail = jsonNode.get("encryptedData").asText();
            String decryptedEmail = this.cryptoService.decryptData(encryptedEmail);
            boolean isUserExists = this.userService.isEmailExists(encryptedEmail);
            boolean isEmailValid = this.validationService.validateEmail(decryptedEmail);
            if (isUserExists || isEmailValid == false) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else {
                return this.sendVerificationCode(decryptedEmail, "rejestrację", httpServletResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> handleLoginVerification(String encryptedId, HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedId);
            String decryptedId = this.cryptoService.decryptData(jsonNode.get("encryptedData").asText());
            Optional<User> user = this.userRepository.findById(Long.valueOf(decryptedId));
            if (user.isPresent()) {
                String decryptedEmail = this.cryptoService.decryptData(user.get().getEmailAddress());
                return this.sendVerificationCode(decryptedEmail, "logowanie", httpServletResponse);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> handleOperationVerification(String encryptedOperation,
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(encryptedOperation);
            String decryptedOperation = this.cryptoService.decryptData(jsonNode.get("encryptedData").asText());
            String token = this.cookieService.getCookieValue(httpServletRequest, "ACCESS_TOKEN");
            String identificatorFromToken = this.tokenService.getIdentificatorFromToken(token);
            Optional<User> user = this.userRepository.findById(Long.valueOf(identificatorFromToken));
            if (user.isPresent()) {
                String decryptedEmail = this.cryptoService.decryptData(user.get().getEmailAddress());
                this.validationService.validateOperation(decryptedOperation);
                return this.sendVerificationCode(decryptedEmail, decryptedOperation, httpServletResponse);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> sendVerificationCode(String email, String operation,
            HttpServletResponse httpServletResponse) {
        boolean isEmailValid = this.validationService.validateEmail(email);
        if (isEmailValid) {
            this.verificationCode = this.generateSixDigitCode();
            try {
                this.emailService.sendVerificationCode(email, this.verificationCode, operation);
                this.addVerificationCodeCookie(httpServletResponse);
                return ResponseEntity.status(HttpStatus.OK).build();
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
        }
    }

    private void addVerificationCodeCookie(HttpServletResponse httpServletResponse) throws Exception {
        String encryptedCode = this.cryptoService.encryptData(this.verificationCode);
        Cookie responseCookie = this.cookieService.generateCookie("VERIFICATION_CODE", encryptedCode, false,
                180);
        httpServletResponse.addCookie(responseCookie);
    }

    private String generateSixDigitCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}