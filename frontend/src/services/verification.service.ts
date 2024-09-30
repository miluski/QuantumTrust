import { Injectable } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Account } from '../types/account';

/**
 * @fileoverview VerificationService provides various validation methods for user inputs.
 * It includes methods to validate identifiers, passwords, emails, phone numbers, names, PESEL, documents, addresses, account types, currencies, and more.
 *
 * @service
 * @providedIn root
 *
 * @class VerificationService
 * @method validateIdentifier - Validates an identifier.
 * @param {number} identifier - The identifier to validate.
 * @returns {boolean} - True if the identifier is valid, false otherwise.
 * @method validatePassword - Validates a password.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password is valid, false otherwise.
 * @method validateRepeatedPassword - Validates if the repeated password matches the original password.
 * @param {string} repeatedPassword - The repeated password.
 * @param {string} password - The original password.
 * @returns {boolean} - True if the passwords match, false otherwise.
 * @method validateVerificationCode - Validates a verification code.
 * @param {number} verificationCode - The verification code to validate.
 * @returns {boolean} - True if the verification code is valid, false otherwise.
 * @method validateEmail - Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 * @method validatePhoneNumber - Validates a phone number.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 * @method validateFirstName - Validates a first name.
 * @param {string} firstName - The first name to validate.
 * @returns {boolean} - True if the first name is valid, false otherwise.
 * @method validateLastName - Validates a last name.
 * @param {string} lastName - The last name to validate.
 * @returns {boolean} - True if the last name is valid, false otherwise.
 * @method validatePESEL - Validates a PESEL number.
 * @param {number} pesel - The PESEL number to validate.
 * @returns {boolean} - True if the PESEL number is valid, false otherwise.
 * @method validateIdentityDocumentType - Validates an identity document type.
 * @param {string} documentType - The document type to validate.
 * @returns {boolean} - True if the document type is valid, false otherwise.
 * @method validateDocument - Validates a document.
 * @param {string} document - The document to validate.
 * @returns {boolean} - True if the document is valid, false otherwise.
 * @method validateAddress - Validates an address.
 * @param {string} address - The address to validate.
 * @returns {boolean} - True if the address is valid, false otherwise.
 * @method validateAccountType - Validates an account type.
 * @param {string} accountType - The account type to validate.
 * @returns {boolean} - True if the account type is valid, false otherwise.
 * @method validateAccountCurrency - Validates an account currency.
 * @param {string} accountCurrency - The account currency to validate.
 * @returns {boolean} - True if the account currency is valid, false otherwise.
 * @method validateSelectedAccount - Validates if the selected account exists in the valid accounts array.
 * @param {Account[]} validAccountsArray - The array of valid accounts.
 * @param {string} selectedAccountNumber - The selected account number to validate.
 * @returns {boolean} - True if the selected account exists, false otherwise.
 * @method validateTransferTitle - Validates a transfer title.
 * @param {string} title - The transfer title to validate.
 * @returns {boolean} - True if the transfer title is valid, false otherwise.
 * @method validateReceiverAccountId - Validates a receiver account ID.
 * @param {string} accountId - The receiver account ID to validate.
 * @param {string} senderAccountId - The sender account ID.
 * @returns {boolean} - True if the receiver account ID is valid, false otherwise.
 * @method validateOperationAmount - Validates an operation amount.
 * @param {number} operationAmount - The operation amount to validate.
 * @param {Account} account - The account to validate against.
 * @returns {boolean} - True if the operation amount is valid, false otherwise.
 * @method validateSelectedAvatarType - Validates the type of the selected avatar.
 * @param {Blob} avatar - The avatar to validate.
 * @returns {boolean} - True if the avatar type is valid, false otherwise.
 * @method validateSelectedAvatarSize - Validates the size of the selected avatar.
 * @param {Blob} avatar - The avatar to validate.
 * @returns {boolean} - True if the avatar size is valid, false otherwise.
 * @method validateInput - Validates an input field.
 * @param {NgModel} input - The input field to validate.
 * @returns {boolean} - True if the input field is valid, false otherwise.
 */
@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  validateIdentifier(identifier: number): boolean {
    return (
      identifier < 99999999 &&
      identifier > 9999999 &&
      Number.isInteger(identifier)
    );
  }
  validatePassword(password: string): boolean {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\/\+\-_;,.!@#$%^&*()]).{12,32}$/;
    return (
      password !== undefined &&
      password.length >= 12 &&
      password.length <= 32 &&
      passwordPattern.test(password)
    );
  }
  validateRepeatedPassword(
    repeatedPassword: string,
    password: string
  ): boolean {
    return repeatedPassword === password;
  }
  validateVerificationCode(verificationCode: number): boolean {
    return (
      verificationCode < 999999 &&
      verificationCode > 99999 &&
      Number.isInteger(verificationCode)
    );
  }
  validateEmail(email: string): boolean {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return email !== undefined && emailPattern.test(email);
  }
  validatePhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\+?\d{9,12}$/;
    return phoneNumber !== undefined && phonePattern.test(phoneNumber);
  }
  validateFirstName(firstName: string): boolean {
    return (
      firstName !== undefined &&
      firstName.length <= 50 &&
      firstName.length >= 3 &&
      firstName !== ''
    );
  }
  validateLastName(lastName: string): boolean {
    const lastNamePattern = /^[a-zA-Z]+([ -]?[a-zA-Z]+)*$/;
    return (
      lastName !== undefined &&
      lastName.length <= 60 &&
      lastName.length >= 3 &&
      lastName !== '' &&
      lastNamePattern.test(lastName)
    );
  }
  validatePESEL(pesel: number): boolean {
    const peselPattern = /^\d{11}$/;
    return pesel !== undefined && peselPattern.test(pesel.toString());
  }
  validateIdentityDocumentType(documentType: string): boolean {
    return (
      (documentType !== undefined && documentType === 'Dowód Osobisty') ||
      documentType === 'Paszport'
    );
  }
  validateDocument(document: string): boolean {
    const documentPattern = /^[A-Z]{3}\s\d{6}$/;
    return (
      document !== undefined &&
      document.length >= 10 &&
      documentPattern.test(document)
    );
  }
  validateAddress(address: string): boolean {
    const addressPattern =
      /^[A-Za-z0-9'\.\-\s\,]/;
    return address !== undefined && addressPattern.test(address);
  }
  validateAccountType(accountType: string): boolean {
    return (
      accountType === 'Konto osobiste' ||
      accountType === 'Konto dla młodych' ||
      accountType === 'Konto wielowalutowe' ||
      accountType === 'Konto rodzinne' ||
      accountType === 'Konto senior'
    );
  }
  validateAccountCurrency(accountCurrency: string): boolean {
    const validCurrencies = [
      'PLN',
      'EUR',
      'USD',
      'GBP',
      'CHF',
      'JPY',
      'AUD',
      'CAD',
    ];
    return validCurrencies.includes(accountCurrency);
  }
  validateSelectedAccount(
    validAccountsArray: Account[],
    selectedAccountNumber: string
  ): boolean {
    return validAccountsArray.some(
      (account: Account) => account.id === selectedAccountNumber
    );
  }
  validateTransferTitle(title: string): boolean {
    return title !== undefined && title.length >= 10 && title.length <= 50;
  }
  validateReceiverAccountId(
    accountId: string,
    senderAccountId: string
  ): boolean {
    const accountNumberRegex = /^[A-Z]{2}\d{2}(?:\s?\d{4})+$/;
    return (
      accountId !== undefined &&
      accountNumberRegex.test(accountId) &&
      accountId !== senderAccountId
    );
  }
  validateOperationAmount(operationAmount: number, account: Account): boolean {
    return (
      !isNaN(operationAmount) &&
      operationAmount >= 1 &&
      operationAmount <= (account.balance as number)
    );
  }
  validateSelectedAvatarType(avatar: Blob): boolean {
    const validTypes: string[] = ['image/png', 'image/jpeg'];
    return validTypes.includes(avatar.type);
  }
  validateSelectedAvatarSize(avatar: Blob): boolean {
    const maxSize: number = 1024 * 1024;
    return avatar.size <= maxSize;
  }
  validateInput(input: NgModel): boolean {
    const isInvalid: boolean = input.invalid === true;
    const isDirty: boolean = input.dirty === true;
    const isTouched: boolean = input.touched === true;
    return isInvalid && (isDirty || isTouched);
  }
}
