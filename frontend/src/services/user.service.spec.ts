import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment.development';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { CardSettings } from '../types/card-settings';
import { Currency } from '../types/currency';
import { Deposit } from '../types/deposit';
import { UserAccount } from '../types/user-account';
import { AlertService } from './alert.service';
import { ConvertService } from './convert.service';
import { CryptoService } from './crypto.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let cryptoService: CryptoService;
  let cookieService: CookieService;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        CryptoService,
        CookieService,
        ConvertService,
        AlertService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    cryptoService = TestBed.inject(CryptoService);
    cookieService = TestBed.inject(CookieService);
    alertService = TestBed.inject(AlertService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should logout and reset user objects', () => {
    service.logout();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(service.userAccountsSubject.getValue()).toEqual([]);
    expect(service.userDepositsSubject.getValue()).toEqual([]);
    expect(service.userCardsSubject.getValue()).toEqual([]);
    expect(service.userTransactionsSubject.getValue()).toEqual([]);
  });

  it('should send verification email for login', () => {
    service.operation = 'login';
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.sendVerificationEmail('data');
    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/login/verification/send-email`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ encryptedData: 'encryptedData' });
    req.flush({});
  });

  it('should set editing card', () => {
    const card: Card = { id: '1', limits: [], fees: {} } as unknown as Card;
    service.setEditingCard(card);
    expect(service['editingCard']).toEqual(card);
  });

  it('should set logging user account', () => {
    const userAccount: UserAccount = { password: 'password' } as UserAccount;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedPassword');
    service.setLoggingUserAccount(userAccount);
    expect(service['loginData']).toEqual('encryptedPassword');
  });

  it('should set registering user account', () => {
    const userAccount: UserAccount = {
      address: 'address',
      password: 'password',
    } as UserAccount;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.setRegisteringUserAccount(userAccount);
    expect(service['registeringUserAccount']).toEqual(
      jasmine.objectContaining({
        address: 'encryptedData',
        password: 'encryptedData',
      })
    );
  });

  it('should set editing user account', () => {
    const userAccount: UserAccount = {
      address: 'address',
      password: 'password',
    } as UserAccount;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.setEditingUserAccount(userAccount);
    expect(service['editingUserAccount']).toEqual(
      jasmine.objectContaining({
        address: 'encryptedData',
        password: 'encryptedData',
      })
    );
  });

  it('should set opening bank account', () => {
    const account: Account = { type: 'personal', balance: 0 } as Account;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.setOpeningBankAccount(account);
    expect(service['openingBankAccount']).toEqual('encryptedData');
  });

  it('should set opening deposit', () => {
    const deposit: Deposit = { amount: 1000 } as unknown as Deposit;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.setOpeningDeposit(deposit);
    expect(service['openingDeposit']).toEqual('encryptedData');
  });

  it('should set transfer object', () => {
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    service.setTransferObject('sender', 'receiver', 'title', 100);
    expect(service['transferObject']).toEqual('encryptedData');
  });

  it('should validate code', () => {
    spyOn(cookieService, 'get').and.returnValue('encryptedCode');
    spyOn(cryptoService, 'decryptData').and.returnValue('verificationCode');
    expect(service.getIsCodeValid('verificationCode')).toBeTrue();
  });

  it('should refresh tokens', () => {
    service.refreshTokens();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should check if user does not exist', async () => {
    const userAccount: UserAccount = { emailAddress: 'email' } as UserAccount;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedEmail');
    const promise = service.getIsUserNotExists(userAccount);
    const req = httpMock.expectOne(
      `${environment.apiUrl}/user/email?email=encryptedEmail`
    );
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 404, statusText: 'Not Found' });
    expect(await promise).toBeTrue();
  });

  it('should get user full name', () => {
    service['currentUserAccount'].next({
      firstName: 'John',
      lastName: 'Doe',
    } as UserAccount);
    expect(service.userFullName).toBe('J.DOE');
  });

  it('should get user account', () => {
    const userAccount: UserAccount = {
      firstName: 'John',
      lastName: 'Doe',
    } as UserAccount;
    service['currentUserAccount'].next(userAccount);
    expect(service.userAccount).toEqual(userAccount);
  });

  it('should check if account exists', async () => {
    spyOn(cryptoService, 'encryptData').and.returnValue(
      'encryptedAccountNumber'
    );
    const promise = service.getIsAccountExists('accountNumber');
    const req = httpMock.expectOne(
      `${environment.apiUrl}/user/account?accountNumber=encryptedAccountNumber`
    );
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should login user', async () => {
    service['loginData'] = 'loginData';
    const promise = service['login']();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should open new bank account', async () => {
    service['openingBankAccount'] = 'openingBankAccount';
    const promise = service['openNewBankAccount']();
    const req = httpMock.expectOne(`${environment.apiUrl}/user/account/open`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should open new deposit', async () => {
    service['openingDeposit'] = 'openingDeposit';
    const promise = service['openNewDeposit']();
    const req = httpMock.expectOne(`${environment.apiUrl}/deposits/new`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should send new transfer', async () => {
    service['transferObject'] = 'transferObject';
    const promise = service['sendNewTransfer']();
    const req = httpMock.expectOne(`${environment.apiUrl}/user/new-transfer`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should order new card', async () => {
    service['creatingCardObject'] = 'creatingCardObject';
    const promise = service['orderNewCard']();
    const req = httpMock.expectOne(`${environment.apiUrl}/cards/new`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should suspend card', async () => {
    service['editingCard'] = { id: '1' } as unknown as Card;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedCardId');
    const promise = service['suspendCard']();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/cards/suspend?id=encryptedCardId`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should unsuspend card', async () => {
    service['editingCard'] = { id: '1' } as unknown as Card;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedCardId');
    const promise = service['unsuspendCard']();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/cards/unsuspend?id=encryptedCardId`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should edit card', async () => {
    service['editingCard'] = {
      id: '1',
      expirationDate: '12/23',
      limits: [],
      fees: {},
    } as unknown as Card;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    const promise = service['editCard']();
    const req = httpMock.expectOne(`${environment.apiUrl}/cards/edit`);
    expect(req.request.method).toBe('PATCH');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should edit account settings', async () => {
    service['editingUserAccount'] = {
      emailAddress: 'email',
      phoneNumber: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'avatarUrl',
    } as unknown as UserAccount;
    spyOn(cryptoService, 'encryptData').and.returnValue('encryptedData');
    const promise = service['editAccountSettings']();
    const req = httpMock.expectOne(`${environment.apiUrl}/user/edit`);
    expect(req.request.method).toBe('PATCH');
    req.flush({}, { status: 200, statusText: 'OK' });
    expect(await promise).toBeTrue();
  });

  it('should get expiration date', () => {
    const expirationDate = service['getExpirationDate']();
    expect(expirationDate).toMatch(/^\d{2}-\d{2}-\d{4}$/);
  });

  it('should get limits', () => {
    const card: Card = {
      limits: [
        { internetTransactions: [1000, 500], cashTransactions: [500, 250] },
      ],
    } as Card;
    const cardSettings: CardSettings = {
      limits: { internetTransactionsLimit: 1000, cashTransactionsLimit: 500 },
    } as CardSettings;
    const limits = service['getLimits'](card, cardSettings);
    expect(limits).toEqual([
      {
        internetTransactions: [1000, 500, 1000],
        cashTransactions: [500, 250, 500],
      },
    ]);
  });

  it('should get fees', () => {
    const card: Card = { fees: { monthly: 10, release: 20 } } as Card;
    const currency: Currency = { code: 'USD' } as unknown as Currency;
    spyOn(service['convertService'], 'getCalculatedAmount').and.returnValue(10);
    const fees = service['getFees'](card, currency);
    expect(fees).toEqual({ monthly: 10, release: 10 });
  });

  it('should reset user objects', () => {
    service['resetUserObjects']();
    expect(service.userAccountsSubject.getValue()).toEqual([]);
    expect(service.userDepositsSubject.getValue()).toEqual([]);
    expect(service.userCardsSubject.getValue()).toEqual([]);
    expect(service.userTransactionsSubject.getValue()).toEqual([]);
  });

  it('should get account image', () => {
    expect(service['getAccountImage']('personal')).toBe('first-account.webp');
    expect(service['getAccountImage']('young')).toBe('second-account.webp');
    expect(service['getAccountImage']('multiCurrency')).toBe(
      'third-account.webp'
    );
    expect(service['getAccountImage']('family')).toBe('fourth-account.webp');
    expect(service['getAccountImage']('oldPeople')).toBe('fifth-account.webp');
  });

  it('should show alert', () => {
    spyOn(alertService, 'show');
    service['showAlert']();
    expect(alertService.alertContent).toBe(
      'Użytkownik o podanym adresie email już istnieje.'
    );
    expect(alertService.alertIcon).toBe('fa-circle-xmark');
    expect(alertService.alertTitle).toBe('Błąd');
    expect(alertService.alertType).toBe('error');
    expect(alertService.progressBarBorderColor).toBe('#fca5a5');
    expect(alertService.show).toHaveBeenCalled();
  });

  it('should show unexpected error alert', () => {
    spyOn(alertService, 'show');
    service['showUnexpectedErrorAlert']();
    expect(alertService.alertContent).toBe('Wystąpił nieoczekiwany problem.');
    expect(alertService.alertIcon).toBe('fa-circle-exclamation');
    expect(alertService.alertTitle).toBe('Ostrzeżenie');
    expect(alertService.alertType).toBe('warning');
    expect(alertService.progressBarBorderColor).toBe('#fde047');
    expect(alertService.show).toHaveBeenCalled();
  });
});
