import { TestBed } from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { Account } from '../types/account';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should validate identifier correctly', () => {
    expect(service.validateIdentifier(12345678)).toBeTrue();
    expect(service.validateIdentifier(1234567)).toBeFalse();
    expect(service.validateIdentifier(123456789)).toBeFalse();
  });
  it('should validate password correctly', () => {
    expect(service.validatePassword('ValidPass123!')).toBeTrue();
    expect(service.validatePassword('short1!')).toBeFalse();
    expect(service.validatePassword('nouppercase123!')).toBeFalse();
  });
  it('should validate repeated password correctly', () => {
    expect(service.validateRepeatedPassword('password', 'password')).toBeTrue();
    expect(
      service.validateRepeatedPassword('password', 'different')
    ).toBeFalse();
  });
  it('should validate verification code correctly', () => {
    expect(service.validateVerificationCode(123456)).toBeTrue();
    expect(service.validateVerificationCode(12345)).toBeFalse();
    expect(service.validateVerificationCode(1234567)).toBeFalse();
  });
  it('should validate email correctly', () => {
    expect(service.validateEmail('test@example.com')).toBeTrue();
    expect(service.validateEmail('invalid-email')).toBeFalse();
  });
  it('should validate phone number correctly', () => {
    expect(service.validatePhoneNumber('+1234567890')).toBeTrue();
    expect(service.validatePhoneNumber('123')).toBeFalse();
  });
  it('should validate first name correctly', () => {
    expect(service.validateFirstName('John')).toBeTrue();
    expect(service.validateFirstName('Jo')).toBeFalse();
  });
  it('should validate last name correctly', () => {
    expect(service.validateLastName('Doe')).toBeTrue();
    expect(service.validateLastName('D')).toBeFalse();
  });
  it('should validate PESEL correctly', () => {
    expect(service.validatePESEL(12345678901)).toBeTrue();
    expect(service.validatePESEL(1234567890)).toBeFalse();
  });
  it('should validate identity document type correctly', () => {
    expect(service.validateIdentityDocumentType('Dowód Osobisty')).toBeTrue();
    expect(service.validateIdentityDocumentType('Invalid')).toBeFalse();
  });
  it('should validate document correctly', () => {
    expect(service.validateDocument('ABC 123456')).toBeTrue();
    expect(service.validateDocument('123456')).toBeFalse();
  });
  it('should validate address correctly', () => {
    expect(service.validateAddress('Main Street 123')).toBeTrue();
  });
  it('should validate account type correctly', () => {
    expect(service.validateAccountType('Konto osobiste')).toBeTrue();
    expect(service.validateAccountType('Invalid')).toBeFalse();
  });
  it('should validate account currency correctly', () => {
    expect(service.validateAccountCurrency('PLN')).toBeTrue();
    expect(service.validateAccountCurrency('XYZ')).toBeFalse();
  });
  it('should validate selected account correctly', () => {
    const validAccounts: Account[] = [
      {
        id: '123',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    expect(service.validateSelectedAccount(validAccounts, '123')).toBeTrue();
    expect(service.validateSelectedAccount(validAccounts, '456')).toBeFalse();
  });
  it('should validate transfer title correctly', () => {
    expect(service.validateTransferTitle('Valid Title')).toBeTrue();
    expect(service.validateTransferTitle('Short')).toBeFalse();
  });
  it('should validate receiver account ID correctly', () => {
    expect(
      service.validateReceiverAccountId(
        'PL12345678901234567890123456',
        'PL65432109876543210987654321'
      )
    ).toBeTrue();
    expect(
      service.validateReceiverAccountId(
        'InvalidID',
        'PL65432109876543210987654321'
      )
    ).toBeFalse();
  });
  it('should validate operation amount correctly', () => {
    const account: Account = {
      id: '123',
      balance: 1000,
      advertismentText: '',
      advertismentContent: '',
      image: '',
      type: '',
      benefits: [],
    };
    expect(service.validateOperationAmount(500, account)).toBeTrue();
    expect(service.validateOperationAmount(1500, account)).toBeFalse();
  });
  it('should validate selected avatar type correctly', () => {
    const validAvatar = new Blob([], { type: 'image/png' });
    const invalidAvatar = new Blob([], { type: 'application/pdf' });
    expect(service.validateSelectedAvatarType(validAvatar)).toBeTrue();
    expect(service.validateSelectedAvatarType(invalidAvatar)).toBeFalse();
  });
  it('should validate selected avatar size correctly', () => {
    const validAvatar = new Blob([new ArrayBuffer(1024 * 1024)], {
      type: 'image/png',
    });
    const invalidAvatar = new Blob([new ArrayBuffer(1024 * 1024 + 1)], {
      type: 'image/png',
    });
    expect(service.validateSelectedAvatarSize(validAvatar)).toBeTrue();
    expect(service.validateSelectedAvatarSize(invalidAvatar)).toBeFalse();
  });
  it('should validate input correctly', () => {
    const input = { invalid: true, dirty: true, touched: true } as NgModel;
    expect(service.validateInput(input)).toBeTrue();
  });
});
