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
import { CardSettings } from '../types/card-settings';
import { Currency } from '../types/currency';
import { Deposit } from '../types/deposit';
import { limits } from '../types/limits';
import { Transaction } from '../types/transaction';
import { UserAccount } from '../types/user-account';
import { AlertService } from './alert.service';
import { ConvertService } from './convert.service';
import { CryptoService } from './crypto.service';

/**
 * @service UserService
 * @description This service provides methods for managing user data, including accounts, cards, deposits, transactions, and user authentication.
 *
 * @class UserService
 *
 * @property {Card} editingCard - The card being edited.
 * @property {string} loginData - The login data for the user.
 * @property {string} transferObject - The transfer object containing transfer details.
 * @property {string} openingDeposit - The opening deposit data.
 * @property {string} openingBankAccount - The opening bank account data.
 * @property {string} creatingCardObject - The creating card object data.
 * @property {UserAccount} registeringUserAccount - The user account being registered.
 * @property {UserAccount} editingUserAccount - The user account being edited.
 * @property {BehaviorSubject<UserAccount>} currentUserAccount - The current user account subject.
 * @property {BehaviorSubject<Card[]>} userCardsSubject - The user cards subject.
 * @property {BehaviorSubject<Account[]>} userAccountsSubject - The user accounts subject.
 * @property {BehaviorSubject<Deposit[]>} userDepositsSubject - The user deposits subject.
 * @property {BehaviorSubject<Transaction[]>} userTransactionsSubject - The user transactions subject.
 * @property {string} operation - The current operation being performed.
 * @property {Observable<Card[]>} userCards - Observable of user cards.
 * @property {Observable<Account[]>} userAccounts - Observable of user accounts.
 * @property {Observable<Deposit[]>} userDeposits - Observable of user deposits.
 * @property {Observable<Transaction[]>} userTransactions - Observable of user transactions.
 * @property {Observable<UserAccount>} actualUserAccount - Observable of the actual user account.
 *
 * @constructor
 * @param {CryptoService} cryptoService - Service to handle data encryption and decryption.
 * @param {CookieService} cookieService - Service to manage cookies.
 * @param {ConvertService} convertService - Service to handle data conversion.
 * @param {AlertService} alertService - Service to handle alerts.
 * @param {HttpClient} httpClient - The HTTP client service for making HTTP requests.
 *
 * @method logout - Logs out the user and resets user objects.
 * @method sendVerificationEmail - Sends a verification email for the specified operation.
 * @param {string} data - The data to be included in the verification email.
 * @method setEditingCard - Sets the card being edited.
 * @param {Card} editingCard - The card being edited.
 * @method setLoggingUserAccount - Sets the user account being logged in.
 * @param {UserAccount} loggingUserAccount - The user account being logged in.
 * @method setRegisteringUserAccount - Sets the user account being registered.
 * @param {UserAccount} registeringUserAccount - The user account being registered.
 * @method setEditingUserAccount - Sets the user account being edited.
 * @param {UserAccount} editingUserAccount - The user account being edited.
 * @method refreshUserObjects - Refreshes user objects by setting user account details, accounts, deposits, cards, and transactions.
 * @method setOpeningBankAccount - Sets the opening bank account data.
 * @param {Account} openingBankAccount - The opening bank account data.
 * @method setOpeningDeposit - Sets the opening deposit data.
 * @param {Deposit} openingDeposit - The opening deposit data.
 * @method setTransferObject - Sets the transfer object data.
 * @param {string} senderAccountNumber - The sender account number.
 * @param {string} receiverAccountNumber - The receiver account number.
 * @param {string} transferTitle - The transfer title.
 * @param {number} transferAmount - The transfer amount.
 * @method setCreatingCardObject - Sets the creating card object data.
 * @param {Card} card - The card data.
 * @param {CardSettings} cardSettings - The card settings data.
 * @param {number} pinCode - The PIN code for the card.
 * @param {string} assignedAccountNumber - The assigned account number for the card.
 * @param {Currency} currency - The currency for the card.
 * @method getIsCodeValid - Checks if the typed verification code is valid.
 * @param {string} typedVerificationCode - The typed verification code.
 * @returns {boolean} - Returns true if the verification code is valid, otherwise false.
 * @method refreshTokens - Refreshes the authentication tokens.
 * @method getIsUserNotExists - Checks if the user does not exist.
 * @param {UserAccount} userAccount - The user account to check.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user does not exist, otherwise false.
 * @method userFullName - Gets the full name of the user.
 * @returns {string} - Returns the full name of the user.
 * @method userAccount - Gets the current user account.
 * @returns {UserAccount} - Returns the current user account.
 * @method getIsAccountExists - Checks if the account exists.
 * @param {string} accountNumber - The account number to check.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the account exists, otherwise false.
 * @method finalizeOperation - Finalizes the current operation.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the operation is successful, otherwise false.
 * @method register - Registers a new user account.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the registration is successful, otherwise false.
 * @method login - Logs in the user.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the login is successful, otherwise false.
 * @method openNewBankAccount - Opens a new bank account.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the bank account is opened successfully, otherwise false.
 * @method openNewDeposit - Opens a new deposit account.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the deposit account is opened successfully, otherwise false.
 * @method sendNewTransfer - Sends a new transfer.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the transfer is sent successfully, otherwise false.
 * @method orderNewCard - Orders a new card.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the card is ordered successfully, otherwise false.
 * @method suspendCard - Suspends a card.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the card is suspended successfully, otherwise false.
 * @method unsuspendCard - Unsuspends a card.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the card is unsuspended successfully, otherwise false.
 * @method editCard - Edits a card.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the card is edited successfully, otherwise false.
 * @method editAccountSettings - Edits the user account settings.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the account settings are edited successfully, otherwise false.
 * @method getExpirationDate - Gets the expiration date for a card.
 * @returns {string} - Returns the expiration date for the card.
 * @method getLimits - Gets the limits for a card.
 * @param {Card} card - The card data.
 * @param {CardSettings} cardSettings - The card settings data.
 * @returns {limits[]} - Returns an array of limits for the card.
 * @method getFees - Gets the fees for a card.
 * @param {Card} card - The card data.
 * @param {Currency} currency - The currency for the card.
 * @returns {unknown} - Returns the fees for the card.
 * @method resetUserObjects - Resets the user objects.
 * @method setUserAccountDetails - Sets the user account details.
 * @method setUserAccountsArray - Sets the user accounts array.
 * @method setUserDepositsArray - Sets the user deposits array.
 * @method setUserCardsArray - Sets the user cards array.
 * @method setUserTransactionsArray - Sets the user transactions array.
 * @method getAccountImage - Gets the image for an account type.
 * @param {string} accountType - The account type.
 * @returns {string} - Returns the image for the account type.
 * @method showAlert - Shows an alert with a specified message.
 * @method showUnexpectedErrorAlert - Shows an alert for an unexpected error.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private editingCard!: Card;
  private loginData!: string;
  private transferObject!: string;
  private openingDeposit!: string;
  private openingBankAccount!: string;
  private creatingCardObject!: string;
  private registeringUserAccount!: UserAccount;
  private editingUserAccount!: UserAccount;
  private currentUserAccount!: BehaviorSubject<UserAccount>;

  public operation!: string;
  public userCards: Observable<Card[]>;
  public userAccounts: Observable<Account[]>;
  public userDeposits: Observable<Deposit[]>;
  public userTransactions: Observable<Transaction[]>;
  public actualUserAccount: Observable<UserAccount>;
  public userCardsSubject: BehaviorSubject<Card[]>;
  public userAccountsSubject: BehaviorSubject<Account[]>;
  public userDepositsSubject: BehaviorSubject<Deposit[]>;
  public userTransactionsSubject: BehaviorSubject<Transaction[]>;

  constructor(
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private convertService: ConvertService,
    private alertService: AlertService,
    private httpClient: HttpClient
  ) {
    this.currentUserAccount = new BehaviorSubject<UserAccount>(
      new UserAccount()
    );
    this.userCardsSubject = new BehaviorSubject<Card[]>([]);
    this.userAccountsSubject = new BehaviorSubject<Account[]>([]);
    this.userDepositsSubject = new BehaviorSubject<Deposit[]>([]);
    this.userTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
    this.actualUserAccount = this.currentUserAccount.asObservable();
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

  public setEditingCard(editingCard: Card): void {
    this.editingCard = editingCard;
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
    this.registeringUserAccount = {
      ...registeringUserAccount,
      address: this.cryptoService.encryptData(registeringUserAccount.address),
      documentSerie: this.cryptoService.encryptData(
        registeringUserAccount.documentSerie
      ),
      documentType: this.cryptoService.encryptData(
        registeringUserAccount.documentType
      ),
      repeatedPassword: '',
      password: this.cryptoService.encryptData(registeringUserAccount.password),
      firstName: this.cryptoService.encryptData(
        registeringUserAccount.firstName
      ),
      lastName: this.cryptoService.encryptData(registeringUserAccount.lastName),
      emailAddress: this.cryptoService.encryptData(
        registeringUserAccount.emailAddress
      ),
    };
  }

  public setEditingUserAccount(editingUserAccount: UserAccount): void {
    editingUserAccount.address = this.cryptoService.encryptData(
      editingUserAccount.address
    );
    editingUserAccount.repeatedPassword = '';
    editingUserAccount.password = this.cryptoService.encryptData(
      editingUserAccount.password
    );
    this.editingUserAccount = editingUserAccount;
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

  public setTransferObject(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    transferTitle: string,
    transferAmount: number
  ): void {
    const transferObject: any = {
      senderAccountNumber: senderAccountNumber,
      receiverAccountNumber: receiverAccountNumber,
      transferTitle: transferTitle,
      transferAmount: transferAmount,
    };
    this.transferObject = this.cryptoService.encryptData(
      JSON.stringify(transferObject)
    );
  }

  public setCreatingCardObject(
    card: Card,
    cardSettings: CardSettings,
    pinCode: number,
    assignedAccountNumber: string,
    currency: Currency
  ): void {
    const cardCopy: Card = { ...card };
    const creatingCardObject: unknown = {
      ...cardCopy,
      assignedAccountNumber: assignedAccountNumber,
      limits: this.cryptoService.encryptData(
        this.getLimits(cardCopy, cardSettings)
      ),
      pin: this.cryptoService.encryptData(pinCode),
      expirationDate: this.getExpirationDate(),
      fees: this.cryptoService.encryptData(
        JSON.stringify(this.getFees(cardCopy, currency))
      ),
      status: 'unsuspended',
    };
    this.creatingCardObject = this.cryptoService.encryptData(
      JSON.stringify(creatingCardObject)
    );
  }

  public getIsCodeValid(typedVerificationCode: string): boolean {
    const encryptedCode: string = this.cookieService.get('VERIFICATION_CODE');
    const verificationCode: string =
      this.cryptoService.decryptData(encryptedCode);
    return verificationCode === typedVerificationCode;
  }

  public refreshTokens(): void {
    this.httpClient
      .post(`${environment.apiUrl}/auth/refresh-token`, {})
      .subscribe();
  }

  public getIsUserNotExists(userAccount: UserAccount): Promise<boolean> {
    const encryptedEmail: string = this.cryptoService.encryptData(
      userAccount.emailAddress
    );
    const encodedEmail: string = encodeURIComponent(encryptedEmail);
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/email?email=${encodedEmail}`,
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: () => {
          this.showAlert();
          resolve(false);
        },
        error: (response: HttpErrorResponse) => {
          if (response.status !== 404) {
            this.showUnexpectedErrorAlert();
          }
          resolve(response.status === 404);
        },
      });
    });
  }

  public get userFullName(): string {
    const firstLetterOfFirstName: string =
      this.userAccount.firstName?.substring(0, 1).toUpperCase() || '';
    const lastName: string = this.userAccount.lastName?.toUpperCase() || '';
    return firstLetterOfFirstName + '.' + lastName;
  }

  public get userAccount(): UserAccount {
    return this.currentUserAccount.getValue();
  }

  public async getIsAccountExists(accountNumber: string): Promise<boolean> {
    const encryptedAccountNumber: string =
      this.cryptoService.encryptData(accountNumber);
    const encodedAccountNumber: string = encodeURIComponent(
      encryptedAccountNumber
    );
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/user/account?accountNumber=${encodedAccountNumber}`,
      this.openingDeposit,
      {
        observe: 'response',
      }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          resolve(false);
        },
      });
    });
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
      case 'new-transfer':
        return this.sendNewTransfer();
      case 'order-card':
        return this.orderNewCard();
      case 'suspend-card':
        return this.suspendCard();
      case 'unsuspend-card':
        return this.unsuspendCard();
      case 'edit-card':
        return this.editCard();
      case 'edit-account-settings':
        return this.editAccountSettings();
      default:
        return false;
    }
  }

  private async register(): Promise<boolean> {
    const registeringUser: string = this.cryptoService.encryptData(
      JSON.stringify({
        ...this.registeringUserAccount,
        phoneNumber: this.cryptoService.encryptData(
          this.registeringUserAccount.phoneNumber
        ),
      })
    );
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/auth/register`,
      {
        encryptedAccountDto: this.openingBankAccount,
        encryptedUserDto: registeringUser,
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

  private async login(): Promise<boolean> {
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

  private async openNewBankAccount(): Promise<boolean> {
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

  private async openNewDeposit(): Promise<boolean> {
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

  private async sendNewTransfer(): Promise<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/user/new-transfer`,
      this.transferObject,
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

  private async orderNewCard(): Promise<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/cards/new`,
      this.creatingCardObject,
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

  private async suspendCard(): Promise<boolean> {
    const encryptedCardId: string = this.cryptoService.encryptData(
      this.editingCard.id
    );
    const encodedCardId: string = encodeURIComponent(encryptedCardId);
    const request: Observable<HttpResponse<Object>> = this.httpClient.patch(
      `${environment.apiUrl}/cards/suspend?id=${encodedCardId}`,
      {},
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          resolve(false);
        },
      });
    });
  }

  private async unsuspendCard(): Promise<boolean> {
    const encryptedCardId: string = this.cryptoService.encryptData(
      this.editingCard.id
    );
    const encodedCardId: string = encodeURIComponent(encryptedCardId);
    const request: Observable<HttpResponse<Object>> = this.httpClient.patch(
      `${environment.apiUrl}/cards/unsuspend?id=${encodedCardId}`,
      {},
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          resolve(false);
        },
      });
    });
  }

  private async editCard(): Promise<boolean> {
    const cardCopy: Card = { ...this.editingCard };
    const [month, year] = (cardCopy.expirationDate as string)
      .split('/')
      .map(Number);
    const expirationDate = new Date(2000 + year, month - 1, 1);
    const formattedExpirationDate = expirationDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');
    const creatingCardObject: Object = {
      ...cardCopy,
      expirationDate: formattedExpirationDate,
      limits: this.cryptoService.encryptData(cardCopy.limits),
      pin: this.cryptoService.encryptData(cardCopy.pin as number),
      fees: this.cryptoService.encryptData(cardCopy.fees),
    };
    const encryptedCardObject: string = this.cryptoService.encryptData(
      JSON.stringify(creatingCardObject)
    );
    const request: Observable<HttpResponse<Object>> = this.httpClient.patch(
      `${environment.apiUrl}/cards/edit`,
      encryptedCardObject,
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          resolve(false);
        },
      });
    });
  }

  private async editAccountSettings(): Promise<boolean> {
    const editingObject: Object = {
      ...this.editingUserAccount,
      avatarPath: this.cryptoService.encryptData(
        this.editingUserAccount.avatarUrl as string
      ),
      emailAddress: this.cryptoService.encryptData(
        this.editingUserAccount.emailAddress
      ),
      phoneNumber: this.cryptoService.encryptData(
        this.editingUserAccount.phoneNumber
      ),
      firstName: this.cryptoService.encryptData(
        this.editingUserAccount.firstName
      ),
      lastName: this.cryptoService.encryptData(
        this.editingUserAccount.lastName
      ),
      avatarUrl: null,
    };
    const encryptedEditingUserObject: string = this.cryptoService.encryptData(
      JSON.stringify(editingObject)
    );
    const request: Observable<HttpResponse<Object>> = this.httpClient.patch(
      `${environment.apiUrl}/user/edit`,
      encryptedEditingUserObject,
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          resolve(false);
        },
      });
    });
  }

  private getExpirationDate(): string {
    const currentDate: Date = new Date();
    const expirationDate: Date = new Date(
      currentDate.getFullYear() + 4,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const day: string = String(expirationDate.getDate()).padStart(2, '0');
    const month: string = String(expirationDate.getMonth() + 1).padStart(
      2,
      '0'
    );
    const year: number = expirationDate.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private getLimits(card: Card, cardSettings: CardSettings): limits[] {
    return [
      {
        internetTransactions: [
          cardSettings.limits.internetTransactionsLimit,
          card.limits[0].internetTransactions[1],
          card.limits[0].internetTransactions[0],
        ],
        cashTransactions: [
          cardSettings.limits.cashTransactionsLimit,
          card.limits[0].cashTransactions[1],
          card.limits[0].cashTransactions[0],
        ],
      },
    ];
  }

  private getFees(card: Card, currency: Currency): unknown {
    return {
      monthly: this.convertService.getCalculatedAmount(
        'PLN',
        currency,
        card.fees.monthly
      ),
      release: this.convertService.getCalculatedAmount(
        'PLN',
        currency,
        card.fees.release
      ),
    };
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
        const retrievedUserAccount: any = this.cryptoService.decryptData(
          response.body.encryptedData
        );
        this.currentUserAccount.next({
          ...(retrievedUserAccount as unknown as UserAccount),
          address: this.cryptoService.decryptData(retrievedUserAccount.address),
          avatarUrl: this.cryptoService.decryptData(
            retrievedUserAccount.avatarPath
          ),
          emailAddress: this.cryptoService.decryptData(
            retrievedUserAccount.emailAddress
          ),
          firstName: this.cryptoService.decryptData(
            retrievedUserAccount.firstName
          ),
          lastName: this.cryptoService.decryptData(
            retrievedUserAccount.lastName
          ),
          phoneNumber: this.cryptoService.decryptData(
            retrievedUserAccount.phoneNumber
          ) as unknown as number,
        });
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
          card.limits = this.cryptoService.decryptData(card.limits);
          card.fees = this.cryptoService.decryptData(card.fees);
          card.cvcCode = this.cryptoService.decryptData(card.cvcCode);
          card.pin = this.cryptoService.decryptData(card.pin);
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

  private showAlert(): void {
    this.alertService.alertContent =
      'Użytkownik o podanym adresie email już istnieje.';
    this.alertService.alertIcon = 'fa-circle-xmark';
    this.alertService.alertTitle = 'Błąd';
    this.alertService.alertType = 'error';
    this.alertService.progressBarBorderColor = '#fca5a5';
    this.alertService.show();
  }

  private showUnexpectedErrorAlert(): void {
    this.alertService.alertContent = 'Wystąpił nieoczekiwany problem.';
    this.alertService.alertIcon = 'fa-circle-exclamation';
    this.alertService.alertTitle = 'Ostrzeżenie';
    this.alertService.alertType = 'warning';
    this.alertService.progressBarBorderColor = '#fde047';
    this.alertService.show();
  }
}
