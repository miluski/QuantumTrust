package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.model.Fees;
import com.quantum.trust.backend.model.Limits;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.model.entities.Deposit;
import com.quantum.trust.backend.model.entities.User;

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
 * 
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
 *
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
 *
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
public class ValidationService {
    private final Map<String, Limits> validLimits;
    private final CryptoService cryptoService;
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;

    public final Map<String, Fees> validFees;

    @Autowired
    public ValidationService(CryptoService cryptoService, TransactionService transactionService,
            ObjectMapper objectMapper) {
        this.validFees = new HashMap<>();
        this.validLimits = new HashMap<>();
        this.initializeFeesMap();
        this.initializeLimitsMap();
        this.cryptoService = cryptoService;
        this.transactionService = transactionService;
        this.objectMapper = objectMapper;
    }

    public void validateUserObject(User user) throws Exception {
        boolean isEmailValid = this.validateEmail(this.cryptoService.decryptData(user.getEmailAddress()));
        boolean isPhoneNumberValid = this.validatePhoneNumber(this.cryptoService.decryptData(user.getPhoneNumber()));
        boolean isFirstNameValid = this.validateFirstName(this.cryptoService.decryptData(user.getFirstName()));
        boolean isLastNameValid = this.validateLastName(this.cryptoService.decryptData(user.getLastName()));
        boolean isPeselValid = this.validatePESEL(this.cryptoService.decryptData(user.getPeselNumber()));
        boolean isIdentityDocumentTypeValid = this
                .validateIdentityDocumentType(this.cryptoService.decryptData(user.getDocumentType()));
        boolean isDocumentValid = this.validateDocument(this.cryptoService.decryptData(user.getDocumentSerie()));
        boolean isAddressValid = this.validateAddress(this.cryptoService.decryptData(user.getAddress()));
        boolean isPasswordValid = this.validatePassword(user.getPassword());
        if (!(isEmailValid && isPhoneNumberValid && isFirstNameValid && isLastNameValid && isPeselValid
                && isIdentityDocumentTypeValid && isDocumentValid && isAddressValid && isPasswordValid)) {
            throw new IllegalArgumentException("User object is invalid");
        }
    }

    public void validateEditedUserObject(User user) throws Exception {
        boolean isEmailValid = this.validateEmail(this.cryptoService.decryptData(user.getEmailAddress()));
        boolean isPhoneNumberValid = this.validatePhoneNumber(this.cryptoService.decryptData(user.getPhoneNumber()));
        boolean isFirstNameValid = this.validateFirstName(this.cryptoService.decryptData(user.getFirstName()));
        boolean isLastNameValid = this.validateLastName(this.cryptoService.decryptData(user.getLastName()));
        boolean isAddressValid = this.validateAddress(this.cryptoService.decryptData(user.getAddress()));
        if (!(isEmailValid && isPhoneNumberValid && isFirstNameValid && isLastNameValid && isAddressValid)) {
            throw new IllegalArgumentException("User object is invalid");
        }
    }

    public void validateLoginUserObject(User user) throws Exception {
        Long userId = user.getId();
        boolean isPasswordValid = this.validatePassword(this.cryptoService.decryptData(user.getPassword()));
        boolean isIdentifierValid = userId >= 1000000 && userId != null;
        if (!(isPasswordValid && isIdentifierValid)) {
            throw new IllegalArgumentException("Logging User object is invalid");
        }
    }

    public void validateAccountObject(Account account) throws IllegalArgumentException {
        boolean isAccountTypeValid = this.validateAccountType(account.getType());
        boolean isAccountCurrencyValid = this.validateCurrency(account.getCurrency());
        boolean isAccountStartBalanceValid = this.validateAccountBalance(account.getBalance());
        boolean isAccountImageValid = this.validateAccountImage(account.getImage());
        if (!(isAccountTypeValid && isAccountCurrencyValid && isAccountStartBalanceValid && isAccountImageValid)) {
            throw new IllegalArgumentException("Account object is invalid");
        }
    }

    public void validateDeposit(Deposit deposit) throws IllegalArgumentException {
        boolean isBalanceValid = this.validateDepositBalance(deposit);
        boolean isTypeValid = this.validateDepositType(deposit.getType());
        boolean isPercentValid = this.validateDepositPercent(deposit.getPercent());
        boolean isDurationValid = this.validateDuration(deposit.getDuration());
        boolean isEndDateValid = this.validateEndDate(deposit.getEndDate());
        if (!(isBalanceValid && isTypeValid && isPercentValid && isDurationValid && isEndDateValid)) {
            throw new IllegalArgumentException("Deposit object is invalid");
        }
    }

    public void validateCard(Card card) throws Exception {
        boolean isCardTypeValid = this.validateCardType(card.getType());
        boolean isCardPublisherValid = this.validateCardPublisher(card.getPublisher());
        boolean isCardFeesValid = this.validateCardFees(card);
        boolean isCardLimitsValid = this.validateCardLimits(card);
        boolean isCardExpirationDateValid = this.validateCardExpirationDate(card.getExpirationDate());
        boolean isCardPinValid = this.validateCardPin(card.getPin());
        boolean isCardImageValid = this.validateCardImage(card.getImage());
        boolean isShowingCardSiteValid = this.validateShowingCardSite(card.getShowingCardSite());
        boolean isCardBackImageValid = this.validateCardBackImage(card.getBackImage());
        boolean isCardStatusValid = this.validateCardStatus(card.getStatus());
        if (!(isCardTypeValid && isCardPublisherValid && isCardFeesValid && isCardLimitsValid
                && isCardExpirationDateValid && isCardPinValid && isCardImageValid && isShowingCardSiteValid
                && isCardBackImageValid && isCardStatusValid)) {
            throw new IllegalArgumentException("Card object is invalid");
        }
    }

    public Integer getRecalculatedReleaseFee(Card card, Fees cardFees, String fromCurrency) {
        String accountCurrency = card.getAccount().getCurrency();
        Float releaseFee = cardFees.getRelease();
        Float recalculatedFee = this.transactionService.getRecalculatedAmount(fromCurrency,
                accountCurrency, releaseFee);
        return this.roundValue(recalculatedFee);
    }

    public Integer getRecalculatedMonthlyFee(Card card, Fees cardFees, String fromCurrency) {
        String accountCurrency = card.getAccount().getCurrency();
        Float monthlyFee = cardFees.getMonthly();
        Float recalculatedFee = this.transactionService.getRecalculatedAmount(fromCurrency,
                accountCurrency, monthlyFee);
        return this.roundValue(recalculatedFee);
    }

    public void validateImage(String fileName, long fileSize) throws Exception {
        List<String> allowedExtensions = Arrays.asList("webp", "ico", "png", "jpg", "jpeg");
        long maxSizeInBytes = 2 * 1024 * 1024;
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        boolean isFileExtensionValid = allowedExtensions.contains(fileExtension);
        boolean isFileSizeValid = fileSize <= maxSizeInBytes;
        if (isFileExtensionValid == false || isFileSizeValid == false) {
            throw new Exception("Invalid image");
        }
    }

    public void validateOperation(String operation) throws IllegalArgumentException {
        List<String> allowedOperations = Arrays.asList("otworzenie nowego konta bankowego", "wyrobienie nowej karty",
                "otworzenie nowej lokaty", "wysłanie nowego przelewu", "zmianę statusu karty", "edycję danych karty",
                "edycję danych osobistych");
        if (!allowedOperations.contains(operation)) {
            throw new IllegalArgumentException("Invalid operation");
        }
    }

    public boolean validateEmail(String email) {
        String EMAIL_PATTERN = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        if (email == null) {
            return false;
        }
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean validateTransferTitle(String title) {
        return title.length() >= 10 && title.length() <= 50;
    }

    public boolean validateTransferAmount(Float transferAmount, Account senderAccount) {
        return transferAmount >= 1.0f && transferAmount <= senderAccount.getBalance();
    }

    public boolean validatePassword(String password) {
        String passwordPattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\/\\+\\-_;,.!@#$%^&*()]).{12,32}$";
        return password != null && password.length() >= 12 && password.length() <= 32
                && Pattern.matches(passwordPattern, password);
    }

    private boolean validateCardType(String type) {
        List<String> validTypes = Arrays.asList("PODRÓŻNIK", "STUDENT", "BIZNES", "STANDARD");
        return validTypes.contains(type);
    }

    private boolean validateCardPublisher(String publisher) {
        return publisher.equals("Visa") || publisher.equals("Mastercard");
    }

    private boolean validateCardFees(Card card) throws Exception {
        Fees validCardFees = this.validFees.get(card.getType());
        if (validCardFees == null) {
            throw new Exception("Illegal card type.");
        }
        String decryptedCardFees = this.cryptoService.decryptData(card.getFees());
        decryptedCardFees = decryptedCardFees.replace("\\", "\"");
        Fees cardFees = this.objectMapper.readValue(decryptedCardFees, Fees.class);
        float cardReleaseFee = cardFees.getRelease();
        float cardMonthlyFee = cardFees.getMonthly();
        float validRecalculatedReleaseFee = this.getRecalculatedReleaseFee(card,
                validCardFees, "PLN");
        float validRecalculatedMonthlyFee = this.getRecalculatedMonthlyFee(card,
                validCardFees, "PLN");
        boolean isReleaseFeeValid = areFloatsEqual(validRecalculatedReleaseFee, cardReleaseFee,
                0.01f);
        boolean isMontlyFeeValid = areFloatsEqual(validRecalculatedMonthlyFee, cardMonthlyFee,
                0.01f);
        return isReleaseFeeValid && isMontlyFeeValid;
    }

    private boolean validateCardLimits(Card card) throws Exception {
        Limits validCardLimits = this.validLimits.get(card.getType());
        if (validCardLimits == null) {
            throw new Exception("Illegal card type.");
        }
        String decryptedCardLimits = this.cryptoService.decryptData(card.getLimits());
        decryptedCardLimits = this.getAdjustedCardLimitsObject(decryptedCardLimits);
        Limits cardLimits = objectMapper.readValue(decryptedCardLimits, Limits.class);
        boolean isInternetLimitsValid = this.getIsInternetLimitsValid(card, validCardLimits, cardLimits);
        boolean isCashLimitsValid = this.getIsCashLimitsValid(card, validCardLimits, cardLimits);
        boolean isTransactionsCountValid = this.getIsCashTransactionsCountValid(validCardLimits, cardLimits)
                && this.getIsInternetTransactionsCountValid(validCardLimits, cardLimits);
        return isInternetLimitsValid && isCashLimitsValid && isTransactionsCountValid;
    }

    private String getAdjustedCardLimitsObject(String decryptedCardLimits) {
        decryptedCardLimits = decryptedCardLimits.replaceFirst("\\[", "");
        decryptedCardLimits = decryptedCardLimits.replaceFirst("\\](?!.*\\])", "");
        decryptedCardLimits = decryptedCardLimits.replaceFirst("internetTransactions", "\"internetTransactions\"");
        decryptedCardLimits = decryptedCardLimits.replaceFirst("cashTransactions", "\"cashTransactions\"");
        return decryptedCardLimits;
    }

    private boolean getIsInternetLimitsValid(Card card, Limits validCardLimits, Limits cardLimits) {
        Integer validMinLimit = this.getRecalculatedMinLimit(card);
        Integer validMaxLimit = this.getRecalculatedMaxLimit(card, validCardLimits.getInternetTransactions()[0]);
        boolean isLimitHigherThanMin = cardLimits.getInternetTransactions()[0] >= validMinLimit;
        boolean isLimitLowerThanMax = cardLimits.getInternetTransactions()[0] <= validMaxLimit;
        Float cardMaxLimit = Float.valueOf(cardLimits.getInternetTransactions()[2]);
        Float validCardMaxLimit = Float.valueOf(validCardLimits.getInternetTransactions()[0]);
        boolean isMaximumLimitEqualValidLimit = areFloatsEqual(cardMaxLimit, validCardMaxLimit, 0.0001f);
        return isLimitHigherThanMin && isLimitLowerThanMax && isMaximumLimitEqualValidLimit;
    }

    private boolean getIsCashLimitsValid(Card card, Limits validCardLimits, Limits cardLimits) {
        Integer validMinLimit = this.getRecalculatedMinLimit(card);
        Integer validMaxLimit = this.getRecalculatedMaxLimit(card, validCardLimits.getCashTransactions()[0]);
        boolean isLimitHigherThanMin = cardLimits.getCashTransactions()[0] >= validMinLimit;
        boolean isLimitLowerThanMax = cardLimits.getCashTransactions()[0] <= validMaxLimit;
        Float cardMaxLimit = Float.valueOf(cardLimits.getCashTransactions()[2]);
        Float validCardMaxLimit = Float.valueOf(validCardLimits.getCashTransactions()[0]);
        boolean isMaximumLimitEqualValidLimit = areFloatsEqual(cardMaxLimit, validCardMaxLimit, 0.0001f);
        return isLimitHigherThanMin && isLimitLowerThanMax && isMaximumLimitEqualValidLimit;
    }

    private boolean getIsInternetTransactionsCountValid(Limits validCardLimits, Limits cardLimits) {
        Float validCount = Float.valueOf(validCardLimits.getInternetTransactions()[1]);
        Float count = Float.valueOf(cardLimits.getInternetTransactions()[1]);
        return areFloatsEqual(validCount, count, 0.0001f);
    }

    private boolean getIsCashTransactionsCountValid(Limits validCardLimits, Limits cardLimits) {
        Float validCount = Float.valueOf(validCardLimits.getCashTransactions()[1]);
        Float count = Float.valueOf(cardLimits.getCashTransactions()[1]);
        return areFloatsEqual(validCount, count, 0.0001f);
    }

    private boolean areFloatsEqual(float a, float b, float epsilon) {
        return Math.abs(a - b) < epsilon;
    }

    private Integer getRecalculatedMinLimit(Card card) {
        String accountCurrency = card.getAccount().getCurrency();
        Float recalculatedLimit = this.transactionService.getRecalculatedAmount("PLN", accountCurrency, 500);
        return this.roundValue(recalculatedLimit);
    }

    private Integer getRecalculatedMaxLimit(Card card, Float limit) {
        String accountCurrency = card.getAccount().getCurrency();
        Float recalculatedLimit = this.transactionService.getRecalculatedAmount("PLN", accountCurrency, limit);
        return this.roundValue(recalculatedLimit);
    }

    private boolean validateCardExpirationDate(String expirationDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate today = LocalDate.now();
        LocalDate dateToValidate = LocalDate.parse(expirationDate, formatter);
        int currentYear = today.getYear();
        int yearToValidate = dateToValidate.getYear();
        return yearToValidate == currentYear + 4;
    }

    private boolean validateCardPin(String encryptedPin) throws Exception {
        Integer decryptedPin = Integer.valueOf(this.cryptoService.decryptData(encryptedPin));
        return decryptedPin >= 1111 && decryptedPin <= 9999;
    }

    private boolean validateCardImage(String image) {
        List<String> validImages = Arrays.asList("visa-travel.webp", "visa-standard.webp", "visa-student.webp",
                "visa-business.webp", "mastercard-travel.webp", "mastercard-standard.webp", "mastercard-student.webp",
                "mastercard-business.webp");
        return validImages.contains(image);
    }

    private boolean validateShowingCardSite(String cardSite) {
        return cardSite.equals("front") || cardSite.equals("back");
    }

    private boolean validateCardBackImage(String backImage) {
        List<String> validBackImages = Arrays.asList("visa-back.webp", "mastercard-travel-back.webp",
                "mastercard-standard-back.webp", "mastercard-student-back.webp",
                "mastercard-business-back.webp");
        return validBackImages.contains(backImage);
    }

    private boolean validateCardStatus(String status) {
        return status.equals("suspended") || status.equals("unsuspended");
    }

    private boolean validateDepositBalance(Deposit deposit) {
        Float minimumBalance = this.transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 100);
        Float maximumBalance = this.transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 10000);
        minimumBalance = (float) this.roundValue(minimumBalance);
        maximumBalance = (float) this.roundValue(maximumBalance);
        return deposit.getBalance() >= minimumBalance && deposit.getBalance() <= maximumBalance;
    }

    private Integer roundValue(Float value) {
        if (value == null) {
            return null;
        }
        return Math.round(value);
    }

    private boolean validateDepositType(String type) {
        List<String> allowedTypes = Arrays.asList("timely", "family", "mobile", "progressive");
        return allowedTypes.contains(type);
    }

    private boolean validateDepositPercent(Float percent) {
        return percent >= 2.5 && percent <= 5;
    }

    private boolean validateDuration(Integer duration) {
        return duration >= 1 && duration <= 4;
    }

    private boolean validateEndDate(String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();
        LocalDate dateToValidate = LocalDate.parse(endDate, formatter);
        LocalDate oneMonthLater = today.plus(1, ChronoUnit.MONTHS);
        LocalDate threeMonthsLater = today.plus(3, ChronoUnit.MONTHS);
        LocalDate sixMonthsLater = today.plus(6, ChronoUnit.MONTHS);
        LocalDate twelveMonthsLater = today.plus(12, ChronoUnit.MONTHS);
        return dateToValidate.equals(oneMonthLater) ||
                dateToValidate.equals(threeMonthsLater) ||
                dateToValidate.equals(sixMonthsLater) ||
                dateToValidate.equals(twelveMonthsLater);
    }

    private boolean validatePhoneNumber(String phoneNumber) {
        String phonePattern = "^\\+?\\d{9,12}$";
        return phoneNumber != null && Pattern.matches(phonePattern, phoneNumber);
    }

    private boolean validateFirstName(String firstName) {
        return firstName != null && firstName.length() <= 50 && firstName.length() >= 3 && !firstName.isEmpty();
    }

    private boolean validateLastName(String lastName) {
        String lastNamePattern = "^[a-zA-Z]+([ -]?[a-zA-Z]+)*$";
        return lastName != null && lastName.length() <= 60 && lastName.length() >= 3 && !lastName.isEmpty()
                && Pattern.matches(lastNamePattern, lastName);
    }

    private boolean validatePESEL(String pesel) {
        String peselPattern = "^\\d{11}$";
        return pesel != null && Pattern.matches(peselPattern, pesel);
    }

    private boolean validateIdentityDocumentType(String documentType) {
        return documentType != null && (documentType.equals("Dowód Osobisty") || documentType.equals("Paszport"));
    }

    private boolean validateDocument(String document) {
        String documentPattern = "^[A-Z]{3}\\s\\d{6}$";
        return document != null && document.length() >= 10 && Pattern.matches(documentPattern, document);
    }

    private boolean validateAddress(String address) {
        String addressPattern = "^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+)* \\d+(?:\\/\\d+)?(?:, [A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+)+$";
        return address != null && Pattern.matches(addressPattern, address);
    }

    private boolean validateAccountType(String accountType) {
        return accountType != null
                && (accountType.equals("personal") ||
                        accountType.equals("young") ||
                        accountType.equals("multiCurrency") ||
                        accountType.equals("family") ||
                        accountType.equals("oldPeople"));
    }

    private boolean validateCurrency(String currency) {
        List<String> validCurrencies = Arrays.asList(
                "PLN", "EUR", "USD", "GBP", "CHF", "JPY", "AUD", "CAD");
        return currency != null && validCurrencies.contains(currency);
    }

    private boolean validateAccountBalance(Float accountBalance) {
        return accountBalance == 0.00f;
    }

    private boolean validateAccountImage(String accountImage) {
        List<String> validImages = Arrays.asList("first-account.webp", "second-account.webp", "third-account.webp",
                "fourth-account.webp", "fifth-account.webp");
        return accountImage != null && validImages.contains(accountImage);
    }

    private void initializeFeesMap() {
        this.putStandardCardFees();
        this.putStudentCardFees();
        this.putTravelerCardFees();
        this.putBusinessCardFees();
    }

    private void putStandardCardFees() {
        Fees standardCardFees = new Fees(0, 10);
        this.validFees.put("STANDARD", standardCardFees);
    }

    private void putStudentCardFees() {
        Fees studentCardFees = new Fees(0, 0);
        this.validFees.put("STUDENT", studentCardFees);
    }

    private void putTravelerCardFees() {
        Fees travelerCardFees = new Fees(0, 5);
        this.validFees.put("PODRÓŻNIK", travelerCardFees);
    }

    private void putBusinessCardFees() {
        Fees businessCardFees = new Fees(100, 20);
        this.validFees.put("BIZNES", businessCardFees);
    }

    private void initializeLimitsMap() {
        this.putStandardCardLimits();
        this.putStudentCardLimits();
        this.putTravelerCardLimits();
        this.putBusinessCardLimits();
    }

    private void putStandardCardLimits() {
        Float[] validStandardCashLimits = { 5000.0f, 3.0f };
        Float[] validStandardInternetLimits = { 10000.0f, 5.0f };
        this.validLimits.put("STANDARD", new Limits(validStandardInternetLimits, validStandardCashLimits));
    }

    private void putStudentCardLimits() {
        Float[] validStudentCashLimits = { 7000.0f, 5.0f };
        Float[] validStudentInternetLimits = { 15000.0f, 10.0f };
        this.validLimits.put("STUDENT", new Limits(validStudentInternetLimits, validStudentCashLimits));
    }

    private void putTravelerCardLimits() {
        Float[] validTravelerCashLimits = { 10000.0f, 8.0f };
        Float[] validTravelerInternetLimits = { 20000.0f, 15.0f };
        this.validLimits.put("PODRÓŻNIK", new Limits(validTravelerInternetLimits, validTravelerCashLimits));
    }

    private void putBusinessCardLimits() {
        Float[] validBusinessCashLimits = { 50000.0f, 3.0f };
        Float[] validBusinessInternetLimits = { 100000.0f, 5.0f };
        this.validLimits.put("BIZNES", new Limits(validBusinessInternetLimits, validBusinessCashLimits));
    }
}