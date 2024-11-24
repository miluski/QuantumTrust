import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Deposit } from '../types/deposit';
import { Transaction } from '../types/transaction';
import { UserAccount } from '../types/user-account';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginData!: string;
  private openingDeposit!: string;
  private openingBankAccount!: string;
  private registeringUserAccount!: string;
  private currentUserAccount!: UserAccount;
  private userCardsSubject: BehaviorSubject<Card[]>;
  private userAccountsSubject: BehaviorSubject<Account[]>;
  private userDepositsSubject: BehaviorSubject<Deposit[]>;
  private userTransactionsSubject: BehaviorSubject<Transaction[]>;

  public operation!: string;
  public userCards: Observable<Card[]>;
  public userAccounts: Observable<Account[]>;
  public userDeposits: Observable<Deposit[]>;
  public userTransactions: Observable<Transaction[]>;

  constructor(
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {
    this.currentUserAccount = new UserAccount();
    this.userCardsSubject = new BehaviorSubject<Card[]>([]);
    this.userAccountsSubject = new BehaviorSubject<Account[]>([]);
    this.userDepositsSubject = new BehaviorSubject<Deposit[]>([]);
    this.userTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
    this.userCards = this.userCardsSubject.asObservable();
    this.userAccounts = this.userAccountsSubject.asObservable();
    this.userDeposits = this.userDepositsSubject.asObservable();
    this.userTransactions = this.userTransactionsSubject.asObservable();
  }

  public logout(): void {
    const request: Observable<Object> = this.httpClient.post(
      `${environment.apiUrl}/auth/logout`,
      {}
    );
    request.subscribe();
    this.resetUserObjects();
  }

  public refreshTokens(): void {
    this.httpClient
      .post(`${environment.apiUrl}/auth/refresh-token`, {})
      .subscribe();
  }

  public sendVerificationEmail(data: string): void {
    const endpoint: string =
      this.operation === 'login'
        ? `${environment.apiUrl}/auth/login/verification/send-email`
        : this.operation === 'register'
        ? `${environment.apiUrl}/auth/register/verification/send-email`
        : `${environment.apiUrl}/auth/operation/verification/send-email`;
    const encryptedData: string = this.cryptoService.encryptData(data);
    const request: Observable<Object> = this.httpClient.post(endpoint, {
      encryptedData,
    });
    request.subscribe();
  }

  public setLoggingUserAccount(loggingUserAccount: UserAccount): void {
    loggingUserAccount.password = this.cryptoService.encryptData(
      loggingUserAccount.password
    );
    this.loginData = this.cryptoService.encryptData(
      JSON.stringify(loggingUserAccount)
    );
  }

  public setRegisteringUserAccount(registeringUserAccount: UserAccount): void {
    registeringUserAccount.address = this.cryptoService.encryptData(
      registeringUserAccount.address
    );
    registeringUserAccount.documentSerie = this.cryptoService.encryptData(
      registeringUserAccount.documentSerie
    );
    registeringUserAccount.documentType = this.cryptoService.encryptData(
      registeringUserAccount.documentType
    );
    registeringUserAccount.repeatedPassword = '';
    registeringUserAccount.password = this.cryptoService.encryptData(
      registeringUserAccount.password
    );
    this.registeringUserAccount = this.cryptoService.encryptData(
      JSON.stringify(registeringUserAccount)
    );
  }

  public refreshUserObjects(): void {
    this.setUserAccountDetails();
    this.setUserAccountsArray();
    this.setUserDepositsArray();
    this.setUserCardsArray();
    this.setUserTransactionsArray();
  }

  public setOpeningBankAccount(openingBankAccount: Account): void {
    openingBankAccount.balance = 0.0;
    openingBankAccount.image = this.getAccountImage(openingBankAccount.type);
    this.openingBankAccount = this.cryptoService.encryptData(
      JSON.stringify(openingBankAccount)
    );
  }

  public setOpeningDeposit(openingDeposit: Deposit): void {
    this.openingDeposit = this.cryptoService.encryptData(
      JSON.stringify(openingDeposit)
    );
  }

  public getIsCodeValid(typedVerificationCode: string): boolean {
    const encryptedCode: string = this.cookieService.get('VERIFICATION_CODE');
    const verificationCode: string =
      this.cryptoService.decryptData(encryptedCode);
    return verificationCode === typedVerificationCode;
  }

  public get userAccount(): UserAccount {
    return this.currentUserAccount;
  }

  public get userFullName(): string {
    const firstLetterOfFirstName: string =
      this.userAccount.firstName?.substring(0, 1).toUpperCase() || '';
    const lastName: string = this.userAccount.lastName?.toUpperCase() || '';
    return firstLetterOfFirstName + '.' + lastName;
  }

  public async finalizeOperation(): Promise<boolean> {
    switch (this.operation) {
      case 'register':
        return this.register();
      case 'login':
        return this.login();
      case 'logged-user-open-account':
        return this.openNewBankAccount();
      case 'open-deposit':
        return this.openNewDeposit();
      default:
        return false;
    }
  }

  public async register(): Promise<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/auth/register`,
      {
        encryptedAccountDto: this.openingBankAccount,
        encryptedUserDto: this.registeringUserAccount,
      },
      {
        observe: 'response',
      }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => resolve(false),
      });
    });
  }

  public async login(): Promise<boolean> {
    const loginData: string = this.loginData;
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/auth/login`,
      {
        loginData,
      },
      {
        observe: 'response',
      }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => resolve(false),
      });
    });
  }

  public async openNewBankAccount(): Promise<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/user/account/open`,
      this.openingBankAccount,
      {
        observe: 'response',
      }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => resolve(false),
      });
    });
  }

  public async openNewDeposit(): Promise<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/deposits/new`,
      this.openingDeposit,
      {
        observe: 'response',
      }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => resolve(false),
      });
    });
  }

  private resetUserObjects(): void {
    this.userAccountsSubject.next([]);
    this.userDepositsSubject.next([]);
    this.userCardsSubject.next([]);
    this.userTransactionsSubject.next([]);
  }

  private setUserAccountDetails(): void {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/account-object`,
      {
        observe: 'response',
      }
    );
    request.subscribe({
      next: (response: HttpResponse<any>) => {
        this.currentUserAccount = this.cryptoService.decryptData(
          response.body.encryptedData
        ) as unknown as UserAccount;
        this.currentUserAccount.address = this.cryptoService.decryptData(
          this.currentUserAccount.address
        );
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error:', error);
      },
    });
  }

  private setUserAccountsArray(): void {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/all-accounts`,
      {
        observe: 'response',
      }
    );
    request.subscribe({
      next: (response: HttpResponse<any>) => {
        const decryptedAccountsArray: any = this.cryptoService.decryptData(
          response.body.encryptedData
        );
        this.userAccountsSubject.next(decryptedAccountsArray);
      },
      error: () => false,
    });
  }

  private setUserDepositsArray(): void {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/deposits/user/all`,
      {
        observe: 'response',
      }
    );
    request.subscribe({
      next: (response: HttpResponse<any>) => {
        const decryptedDepositsArray: any = this.cryptoService.decryptData(
          response.body.encryptedData
        );
        this.userDepositsSubject.next(decryptedDepositsArray);
      },
      error: () => false,
    });
  }

  private setUserCardsArray(): void {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/cards/user/all`,
      {
        observe: 'response',
      }
    );
    request.subscribe({
      next: (response: HttpResponse<any>) => {
        const decryptedCardsArray: any = this.cryptoService.decryptData(
          response.body.encryptedData
        );
        decryptedCardsArray.forEach((card: any) => {
          if (typeof card.limits === 'string') {
            card.limits = JSON.parse(card.limits);
          }
        });
        this.userCardsSubject.next(decryptedCardsArray);
      },
      error: () => false,
    });
  }

  private setUserTransactionsArray(): void {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/all-transactions`,
      {
        observe: 'response',
      }
    );
    request.subscribe({
      next: (response: HttpResponse<any>) => {
        const decryptedTransactionsArray: any = this.cryptoService.decryptData(
          response.body.encryptedData
        );
        decryptedTransactionsArray.forEach((transaction: any) => {
          if (
            transaction.assignedAccountNumber &&
            !isNaN(transaction.assignedAccountNumber)
          ) {
            transaction.assignedAccountNumber = Number(
              transaction.assignedAccountNumber
            );
          }
        });
        this.userTransactionsSubject.next(decryptedTransactionsArray);
      },
      error: () => false,
    });
  }

  private getAccountImage(accountType: string) {
    switch (accountType) {
      case 'personal':
      default:
        return 'first-account.webp';
      case 'young':
        return 'second-account.webp';
      case 'multiCurrency':
        return 'third-account.webp';
      case 'family':
        return 'fourth-account.webp';
      case 'oldPeople':
        return 'fifth-account.webp';
    }
  }
}
