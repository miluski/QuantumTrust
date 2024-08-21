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
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\/\+\-_;,.!@#$%^&*()]).{12,}$/;
    return (
      password !== undefined &&
      password.length > 12 &&
      passwordPattern.test(password)
    );
  }
  validateVerificationCode(verificationCode: number): boolean {
    return (
      verificationCode < 999999 &&
      verificationCode > 99999 &&
      Number.isInteger(verificationCode)
    );
  }
}
