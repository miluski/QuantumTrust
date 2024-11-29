package com.quantum.trust.backend.services;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
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

@Service
public class ValidationService {
    private final Map<String, Fees> validFees;
    private final Map<String, Limits> validLimits;
    private final CryptoService cryptoService;
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;

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
        boolean isEmailValid = this.validateEmail(user.getEmailAddress());
        boolean isPhoneNumberValid = this.validatePhoneNumber(user.getPhoneNumber());
        boolean isFirstNameValid = this.validateFirstName(user.getFirstName());
        boolean isLastNameValid = this.validateLastName(user.getLastName());
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
        boolean isReleaseFeeValid = cardFees.getRelease() == this.getRecalculatedReleaseFee(card,
                validCardFees);
        boolean isMontlyFeeValid = cardFees.getMonthly() == this.getRecalculatedMonthlyFee(card,
                validCardFees);
        return isReleaseFeeValid && isMontlyFeeValid;
    }

    private Float getRecalculatedReleaseFee(Card card, Fees cardFees) {
        String accountCurrency = card.getAccount().getCurrency();
        Integer releaseFee = cardFees.getRelease();
        Float recalculatedFee = this.transactionService.getRecalculatedAmount("PLN",
                accountCurrency, releaseFee);
        return this.roundToTwoDecimalPlaces(recalculatedFee);
    }

    private Float getRecalculatedMonthlyFee(Card card, Fees cardFees) {
        String accountCurrency = card.getAccount().getCurrency();
        Integer monthlyFee = cardFees.getMonthly();
        Float recalculatedFee = this.transactionService.getRecalculatedAmount("PLN",
                accountCurrency, monthlyFee);
        return this.roundToTwoDecimalPlaces(recalculatedFee);
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
        Float validMinLimit = this.getRecalculatedMinLimit(card);
        Float validMaxLimit = this.getRecalculatedMaxLimit(card, validCardLimits.getInternetTransactions()[0]);
        boolean isLimitHigherThanMin = cardLimits.getInternetTransactions()[0] >= validMinLimit;
        boolean isLimitLowerThanMax = cardLimits.getInternetTransactions()[0] <= validMaxLimit;
        Float cardMaxLimit = Float.valueOf(cardLimits.getInternetTransactions()[2]);
        Float validCardMaxLimit = Float.valueOf(validCardLimits.getInternetTransactions()[0]);
        boolean isMaximumLimitEqualValidLimit = areFloatsEqual(cardMaxLimit, validCardMaxLimit, 0.0001f);
        return isLimitHigherThanMin && isLimitLowerThanMax && isMaximumLimitEqualValidLimit;
    }

    private boolean getIsCashLimitsValid(Card card, Limits validCardLimits, Limits cardLimits) {
        Float validMinLimit = this.getRecalculatedMinLimit(card);
        Float validMaxLimit = this.getRecalculatedMaxLimit(card, validCardLimits.getCashTransactions()[0]);
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

    private Float getRecalculatedMinLimit(Card card) {
        String accountCurrency = card.getAccount().getCurrency();
        Float recalculatedLimit = this.transactionService.getRecalculatedAmount("PLN", accountCurrency, 500);
        return this.roundToTwoDecimalPlaces(recalculatedLimit);
    }

    private Float getRecalculatedMaxLimit(Card card, Float limit) {
        String accountCurrency = card.getAccount().getCurrency();
        Float recalculatedLimit = this.transactionService.getRecalculatedAmount("PLN", accountCurrency, limit);
        return this.roundToTwoDecimalPlaces(recalculatedLimit);
    }

    private boolean validateCardExpirationDate(String expirationDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate today = LocalDate.now();
        LocalDate dateToValidate = LocalDate.parse(expirationDate, formatter);
        LocalDate fourYears = today.plus(4, ChronoUnit.YEARS);
        return dateToValidate.equals(fourYears);
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

    public void validateImage(String fileName, long fileSize) throws Exception {
        List<String> allowedExtensions = Arrays.asList("webp", "ico");
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
                "otworzenie nowej lokaty", "wysłanie nowego przelewu");
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

    private boolean validateDepositBalance(Deposit deposit) {
        Float minimumBalance = this.transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 100);
        Float maximumBalance = this.transactionService.getRecalculatedAmount("PLN", deposit.getCurrency(), 10000);
        minimumBalance = this.roundToTwoDecimalPlaces(minimumBalance);
        maximumBalance = this.roundToTwoDecimalPlaces(maximumBalance);
        return deposit.getBalance() >= minimumBalance && deposit.getBalance() <= maximumBalance;
    }

    private Float roundToTwoDecimalPlaces(Float value) {
        if (value == null) {
            return null;
        }
        BigDecimal bd = new BigDecimal(value.toString());
        bd = bd.round(new MathContext(2, RoundingMode.HALF_EVEN));
        return bd.floatValue();
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

    private boolean validatePassword(String password) {
        String passwordPattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\/\\+\\-_;,.!@#$%^&*()]).{12,32}$";
        return password != null && password.length() >= 12 && password.length() <= 32
                && Pattern.matches(passwordPattern, password);
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