import { Injectable } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Account } from '../types/account';

/**
 * @class VerificationService
 * @description This service is responsible for validating various user inputs and data.
 *
 * @providedIn 'root'
 *
 * @method validateIdentifier - Validates the identifier.
 * @param {number} identifier - The identifier to be validated.
 * @returns {boolean} - Returns true if the identifier is valid, otherwise false.
 * @method validatePassword - Validates the password.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 * @method validateRepeatedPassword - Validates the repeated password.
 * @param {string} repeatedPassword - The repeated password to be validated.
 * @param {string} password - The original password.
 * @returns {boolean} - Returns true if the repeated password matches the original password, otherwise false.
 * @method validateVerificationCode - Validates the verification code.
 * @param {number} verificationCode - The verification code to be validated.
 * @returns {boolean} - Returns true if the verification code is valid, otherwise false.
 * @method validateEmail - Validates the email address.
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - Returns true if the email address is valid, otherwise false.
 * @method validatePhoneNumber - Validates the phone number.
 * @param {string} phoneNumber - The phone number to be validated.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 * @method validateFirstName - Validates the first name.
 * @param {string} firstName - The first name to be validated.
 * @returns {boolean} - Returns true if the first name is valid, otherwise false.
 * @method validateLastName - Validates the last name.
 * @param {string} lastName - The last name to be validated.
 * @returns {boolean} - Returns true if the last name is valid, otherwise false.
 * @method validatePESEL - Validates the PESEL number.
 * @param {number} pesel - The PESEL number to be validated.
 * @returns {boolean} - Returns true if the PESEL number is valid, otherwise false.
 * @method validateIdentityDocumentType - Validates the identity document type.
 * @param {string} documentType - The document type to be validated.
 * @returns {boolean} - Returns true if the document type is valid, otherwise false.
 * @method validateDocument - Validates the document.
 * @param {string} document - The document to be validated.
 * @returns {boolean} - Returns true if the document is valid, otherwise false.
 * @method validateAddress - Validates the address.
 * @param {string} address - The address to be validated.
 * @returns {boolean} - Returns true if the address is valid, otherwise false.
 * @method validateAccountType - Validates the account type.
 * @param {string} accountType - The account type to be validated.
 * @returns {boolean} - Returns true if the account type is valid, otherwise false.
 * @method validateAccountCurrency - Validates the account currency.
 * @param {string} accountCurrency - The account currency to be validated.
 * @returns {boolean} - Returns true if the account currency is valid, otherwise false.
 * @method validateSelectedAccount - Validates the selected account.
 * @param {Account[]} validAccountsArray - The array of valid accounts.
 * @param {string} selectedAccountNumber - The selected account number to be validated.
 * @returns {boolean} - Returns true if the selected account is valid, otherwise false.
 * @method validateTransferTitle - Validates the transfer title.
 * @param {string} title - The transfer title to be validated.
 * @returns {boolean} - Returns true if the transfer title is valid, otherwise false.
 * @method validateReceiverAccountId - Validates the receiver's account ID.
 * @param {string} accountId - The receiver's account ID to be validated.
 * @param {string} senderAccountId - The sender's account ID.
 * @returns {boolean} - Returns true if the receiver's account ID is valid, otherwise false.
 * @method validateOperationAmount - Validates the operation amount.
 * @param {number} operationAmount - The operation amount to be validated.
 * @param {Account} account - The account to be validated against.
 * @returns {boolean} - Returns true if the operation amount is valid, otherwise false.
 * @method validateSelectedAvatarType - Validates the selected avatar type.
 * @param {Blob} avatar - The avatar to be validated.
 * @returns {boolean} - Returns true if the avatar type is valid, otherwise false.
 * @method validateSelectedAvatarSize - Validates the selected avatar size.
 * @param {Blob} avatar - The avatar to be validated.
 * @returns {boolean} - Returns true if the avatar size is valid, otherwise false.
 * @method validateInput - Validates the input.
 * @param {NgModel} input - The input to be validated.
 * @returns {boolean} - Returns true if the input is valid, otherwise false.
 */
@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  public validateIdentifier(identifier: number): boolean {
    return (
      identifier < 99999999 &&
      identifier > 9999999 &&
      Number.isInteger(identifier)
    );
  }

  public validatePassword(password: string): boolean {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\/\+\-_;,.!@#$%^&*()]).{12,32}$/;
    return (
      password !== undefined &&
      password.length >= 12 &&
      password.length <= 32 &&
      passwordPattern.test(password)
    );
  }

  public validateRepeatedPassword(
    repeatedPassword: string,
    password: string
  ): boolean {
    return repeatedPassword === password;
  }

  public validateVerificationCode(verificationCode: number): boolean {
    return (
      verificationCode < 999999 &&
      verificationCode > 99999 &&
      Number.isInteger(verificationCode)
    );
  }

  public validateEmail(email: string): boolean {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return email !== undefined && emailPattern.test(email);
  }

  public validatePhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\+?\d{9,12}$/;
    return phoneNumber !== undefined && phonePattern.test(phoneNumber);
  }

  public validateFirstName(firstName: string): boolean {
    return (
      firstName !== undefined &&
      firstName.length <= 50 &&
      firstName.length >= 3 &&
      firstName !== ''
    );
  }

  public validateLastName(lastName: string): boolean {
    const lastNamePattern = /^[a-zA-Z]+([ -]?[a-zA-Z]+)*$/;
    return (
      lastName !== undefined &&
      lastName.length <= 60 &&
      lastName.length >= 3 &&
      lastName !== '' &&
      lastNamePattern.test(lastName)
    );
  }

  public validatePESEL(pesel: number): boolean {
    const peselPattern = /^\d{11}$/;
    return pesel !== undefined && peselPattern.test(pesel.toString());
  }

  public validateIdentityDocumentType(documentType: string): boolean {
    return (
      (documentType !== undefined && documentType === 'Dowód Osobisty') ||
      documentType === 'Paszport'
    );
  }

  public validateDocument(document: string): boolean {
    const documentPattern = /^[A-Z]{3}\s\d{6}$/;
    return (
      document !== undefined &&
      document.length >= 10 &&
      documentPattern.test(document)
    );
  }

  public validateAddress(address: string): boolean {
    const addressPattern =
      /^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+)* \d+(?:\/\d+)?(?:, [A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+)+$/;
    return address !== undefined && addressPattern.test(address);
  }

  public validateAccountType(accountType: string): boolean {
    return (
      accountType === 'personal' ||
      accountType === 'young' ||
      accountType === 'multiCurrency' ||
      accountType === 'family' ||
      accountType === 'oldPeople'
    );
  }

  public validateAccountCurrency(accountCurrency: string): boolean {
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

  public validateSelectedAccount(
    validAccountsArray: Account[],
    selectedAccountNumber: string
  ): boolean {
    return validAccountsArray.some(
      (account: Account) => account.id === selectedAccountNumber
    );
  }

  public validateTransferTitle(title: string): boolean {
    return title !== undefined && title.length >= 10 && title.length <= 50;
  }

  public validateReceiverAccountId(
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

  public validateOperationAmount(
    operationAmount: number,
    account: Account
  ): boolean {
    return (
      !isNaN(operationAmount) &&
      operationAmount >= 1 &&
      operationAmount <= (account.balance as number)
    );
  }

  public validateSelectedAvatarType(avatar: Blob): boolean {
    const validTypes: string[] = ['image/png', 'image/jpeg'];
    return validTypes.includes(avatar.type);
  }

  public validateSelectedAvatarSize(avatar: Blob): boolean {
    const maxSize: number = 1024 * 1024;
    return avatar.size <= maxSize;
  }

  public validateInput(input: NgModel): boolean {
    const isInvalid: boolean = input.invalid === true;
    const isDirty: boolean = input.dirty === true;
    const isTouched: boolean = input.touched === true;
    return isInvalid && (isDirty || isTouched);
  }
}
