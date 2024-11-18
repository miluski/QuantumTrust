import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, ObservableInput, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Deposit } from '../types/deposit';
import { Transaction } from '../types/transaction';
import { UserAccount } from '../types/user-account';
import { userAccounts } from '../utils/example-user-accounts-object';
import { userCards } from '../utils/example-user-cards-object';
import { userDeposits } from '../utils/example-user-deposits-object';
import { userTransactions } from '../utils/example-user-transactions-object';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public operation!: string;
  private registeringAccount!: string;
  private loginData!: string;
  private registeringUserAccount!: string;
  private verificationCode!: string;

  constructor(
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {}

  finalizeOperation(): boolean {
    switch (this.operation) {
      case 'register':
        return this.register();
      case 'login':
        return this.login();
      default:
        return false;
    }
  }

  register(): boolean {
    const request: Observable<Object> = this.httpClient.post(
      `${environment.apiUrl}/auth/register`,
      {
        encryptedAccountDto: this.registeringAccount,
        encryptedUserDto: this.registeringUserAccount,
      }
    );
    request.subscribe();
    request.pipe(catchError(this.handleRegisterError));
    return true;
  }

  login(): boolean {
    const loginData: string = this.loginData;
    const request: Observable<Object> = this.httpClient.post(
      `${environment.apiUrl}/auth/login`,
      {
        loginData,
      },
      {
        withCredentials: true,
      }
    );
    request.subscribe();
    request.pipe(catchError(this.handleRegisterError));
    return true;
  }

  sendVerificationEmail(data: string): void {
    const endpoint: string =
      this.operation === 'login'
        ? `${environment.apiUrl}/auth/login/verification/send-email`
        : `${environment.apiUrl}/auth/register/verification/send-email`;
    const encryptedData: string = this.cryptoService.encryptData(data);
    const request: Observable<Object> = this.httpClient.post(
      endpoint,
      {
        encryptedData,
      },
      {
        withCredentials: true,
      }
    );
    request.subscribe();
    this.setVerificationCode();
  }

  getIsCodeValid(typedVerificationCode: string): boolean {
    return this.verificationCode === typedVerificationCode;
  }

  setLoggingUserAccount(loggingUserAccount: UserAccount): void {
    this.loginData = this.cryptoService.encryptData(
      JSON.stringify(loggingUserAccount)
    );
  }

  setRegisteringAccount(registeringAccount: Account): void {
    registeringAccount.balance = 0.0;
    registeringAccount.image = this.getAccountImage(registeringAccount.type);
    this.registeringAccount = this.cryptoService.encryptData(
      JSON.stringify(registeringAccount)
    );
  }

  setRegisteringUserAccount(registeringUserAccount: UserAccount): void {
    this.registeringUserAccount = this.cryptoService.encryptData(
      JSON.stringify(registeringUserAccount)
    );
  }

  setVerificationCode(): void {
    setTimeout(() => {
      const encryptedCode: string = this.cookieService.get('VERIFICATION_CODE');
      this.verificationCode = this.cryptoService.decryptData(encryptedCode);
    }, 2000);
  }

  getUserAccountsArray(): Account[] {
    return userAccounts;
  }

  getUserDepositsArray(): Deposit[] {
    return userDeposits;
  }

  getUserTransactionsArray(): Transaction[] {
    return userTransactions;
  }

  getUserCardsArray(): Card[] {
    return userCards;
  }

  get userAccount(): UserAccount {
    const userAccount: UserAccount = new UserAccount();
    userAccount.firstName = 'Maksymilian';
    userAccount.lastName = 'Sowula';
    userAccount.address = 'Al.Tysiąclecia 1/1';
    userAccount.emailAddress = 'example@gmail.com';
    userAccount.phoneNumber = 123456789;
    userAccount.password = 'Test@12345678';
    return userAccount;
  }

  private handleRegisterError(error: HttpErrorResponse): ObservableInput<any> {
    return throwError(() => new Error('Server response code: ' + error.status));
  }

  private getAccountImage(accountType: string) {
    switch (accountType) {
      case 'Konto osobiste':
      default:
        return 'first-account.webp';
      case 'Konto dla młodych':
        return 'second-account.webp';
      case 'Konto wielowalutowe':
        return 'third-account.webp';
      case 'Konto rodzinne':
        return 'fourth-account.webp';
      case 'Konto senior':
        return 'fifth-account.webp';
    }
  }
}
