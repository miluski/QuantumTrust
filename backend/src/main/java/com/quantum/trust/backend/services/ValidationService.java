package com.quantum.trust.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;

@Service
public class ValidationService {

    public void validateUserObject(User user) throws IllegalArgumentException {
        boolean isEmailValid = this.validateEmail(user.getEmailAddress());
        boolean isPhoneNumberValid = this.validatePhoneNumber(user.getPhoneNumber());
        boolean isFirstNameValid = this.validateFirstName(user.getFirstName());
        boolean isLastNameValid = this.validateLastName(user.getLastName());
        boolean isPeselValid = this.validatePESEL(String.valueOf(user.getPeselNumber()));
        boolean isIdentityDocumentTypeValid = this.validateIdentityDocumentType(user.getDocumentType());
        boolean isDocumentValid = this.validateDocument(user.getDocumentSerie());
        boolean isAddressValid = this.validateAddress(user.getAddress());
        boolean isPasswordValid = this.validatePassword(user.getPassword());
        if (!(isEmailValid && isPhoneNumberValid && isFirstNameValid && isLastNameValid && isPeselValid
                && isIdentityDocumentTypeValid && isDocumentValid && isAddressValid && isPasswordValid)) {
            throw new IllegalArgumentException("User object is invalid");
        }
    }

    public void validateLoginUserObject(User user) throws IllegalArgumentException {
        Long userId = user.getId();
        boolean isPasswordValid = this.validatePassword(user.getPassword());
        boolean isIdentifierValid = userId >= 1000000 && userId != null;
        if (!(isPasswordValid && isIdentifierValid)) {
            throw new IllegalArgumentException("Logging User object is invalid");
        }
    }

    public void validateAccountObject(Account account) throws IllegalArgumentException {
        boolean isAccountTypeValid = this.validateAccountType(account.getType());
        boolean isAccountCurrencyValid = this.validateAccountCurrency(account.getCurrency());
        boolean isAccountStartBalanceValid = this.validateAccountBalance(account.getBalance());
        boolean isAccountImageValid = this.validateAccountImage(account.getImage());
        if (!(isAccountTypeValid && isAccountCurrencyValid && isAccountStartBalanceValid && isAccountImageValid)) {
            throw new IllegalArgumentException("Account object is invalid");
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
        String addressPattern = "^[A-Za-z0-9'\\.\\-\\s,]+$";
        return address != null && Pattern.matches(addressPattern, address);
    }

    private boolean validatePassword(String password) {
        String passwordPattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\/\\+\\-_;,.!@#$%^&*()]).{12,32}$";
        return password != null && password.length() >= 12 && password.length() <= 32
                && Pattern.matches(passwordPattern, password);
    }

    private boolean validateAccountType(String accountType) {
        return accountType != null
                && (accountType.equals("Konto osobiste") ||
                        accountType.equals("Konto dla młodych") ||
                        accountType.equals("Konto wielowalutowe") ||
                        accountType.equals("Konto rodzinne") ||
                        accountType.equals("Konto senior"));
    }

    private boolean validateAccountCurrency(String accountCurrency) {
        List<String> validCurrencies = Arrays.asList(
                "PLN", "EUR", "USD", "GBP", "CHF", "JPY", "AUD", "CAD");
        return accountCurrency != null && validCurrencies.contains(accountCurrency);
    }

    private boolean validateAccountBalance(Float accountBalance) {
        return accountBalance == 0.00f;
    }

    private boolean validateAccountImage(String accountImage) {
        List<String> validImages = Arrays.asList("first-account.webp", "second-account.webp", "third-account.webp",
                "fourth-account.webp", "fifth-account.webp");
        return accountImage != null && validImages.contains(accountImage);
    }
}
