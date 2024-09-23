import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { Deposit } from '../types/deposit';
import { depositsObjectArray } from '../utils/deposits-objects-array';

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
    return firstName !== undefined && firstName.length <= 50;
  }

  validateLastName(lastName: string): boolean {
    const lastNamePattern = /^[a-zA-Z]+([ -]?[a-zA-Z]+)*$/;
    return (
      lastName !== undefined &&
      lastName.length <= 60 &&
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
      /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\-]+(?:\s[0-9]{1,4}[A-Za-z]?(?:\/[0-9]{1,4})?)?$/;
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

  validateSelectedDeposit(selectedDeposit: Deposit): boolean {
    return depositsObjectArray.some((deposit: Deposit) => {
      deposit.image === selectedDeposit.image &&
        deposit.type === selectedDeposit.type;
    });
  }

  validateDepositDuration(depositDuration: number): boolean {
    return (
      !isNaN(depositDuration) &&
      (depositDuration === 1 ||
        depositDuration === 3 ||
        depositDuration === 6 ||
        depositDuration === 12)
    );
  }

  validateSelectedAccount(
    validAccountsArray: Account[],
    selectedAccount: Account
  ): boolean {
    return validAccountsArray.some(
      (account: Account) =>
        account.id === selectedAccount.id &&
        account.type === selectedAccount.type &&
        account.currency === selectedAccount.currency
    );
  }

  validateTransferTitle(title: string): boolean {
    return title.length >= 10 && title.length <= 50;
  }

  validateReceiverAccountId(accountId: string): boolean {
    const accountNumberRegex = /^PL\d{2}(\s\d{4}){6}$/;
    return accountNumberRegex.test(accountId);
  }

  validateOperationAmount(operationAmount: number, account: Account): boolean {
    return (
      !isNaN(operationAmount) &&
      operationAmount >= 1 &&
      operationAmount <= (account.balance ?? 0)
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
}
