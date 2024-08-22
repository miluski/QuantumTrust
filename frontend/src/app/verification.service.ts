import { Injectable } from '@angular/core';

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
}
