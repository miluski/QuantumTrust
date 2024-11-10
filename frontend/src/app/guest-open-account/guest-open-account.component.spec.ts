import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { GuestOpenAccountComponent } from './guest-open-account.component';
import { GuestOpenAccountModule } from './guest-open-account.module';

describe('GuestOpenAccountComponent', () => {
  let component: GuestOpenAccountComponent;
  let fixture: ComponentFixture<GuestOpenAccountComponent>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let shakeStateService: jasmine.SpyObj<ShakeStateService>;
  beforeEach(async () => {
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateEmail',
      'validatePhoneNumber',
      'validateFirstName',
      'validateLastName',
      'validatePESEL',
      'validateIdentityDocumentType',
      'validateDocument',
      'validateAddress',
      'validatePassword',
      'validateRepeatedPassword',
      'validateAccountCurrency',
      'validateAccountType',
    ]);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['']);
    const shakeStateServiceSpy = jasmine.createSpyObj('ShakeStateService', [
      'setCurrentShakeState',
    ]);
    await TestBed.configureTestingModule({
      imports: [GuestOpenAccountModule, BrowserAnimationsModule],
      providers: [
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ShakeStateService, useValue: shakeStateServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GuestOpenAccountComponent);
    component = fixture.componentInstance;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    shakeStateService = TestBed.inject(
      ShakeStateService
    ) as jasmine.SpyObj<ShakeStateService>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize user account and account with default values', () => {
    expect(component.userAccount.identityDocumentType).toBe('Dowód Osobisty');
    expect(component.account.type).toBe('Konto osobiste');
    expect(component.account.currency).toBe('PLN');
  });
  it('should validate contact data', () => {
    component.userAccount.email = 'test@example.com';
    component.userAccount.phoneNumber = 123456789;
    verificationService.validateEmail.and.returnValue(true);
    verificationService.validatePhoneNumber.and.returnValue(true);
    component['setIsContactDataValid']();
    expect(verificationService.validateEmail).toHaveBeenCalledWith(
      'test@example.com'
    );
    expect(verificationService.validatePhoneNumber).toHaveBeenCalledWith(
      '123456789'
    );
    expect(component.userAccountFlags.isEmailValid).toBeTrue();
    expect(component.userAccountFlags.isPhoneNumberValid).toBeTrue();
  });
  it('should validate full name', () => {
    component.userAccount.name = 'John';
    component.userAccount.surname = 'Doe';
    verificationService.validateFirstName.and.returnValue(true);
    verificationService.validateLastName.and.returnValue(true);
    component['setIsFullNameValid']();
    expect(verificationService.validateFirstName).toHaveBeenCalledWith('John');
    expect(verificationService.validateLastName).toHaveBeenCalledWith('Doe');
    expect(component.userAccountFlags.isNameValid).toBeTrue();
    expect(component.userAccountFlags.isSurnameValid).toBeTrue();
  });
  it('should validate identity data', () => {
    component.userAccount.pesel = 12345678901;
    component.userAccount.identityDocumentType = 'Dowód Osobisty';
    component.userAccount.identityDocumentSerie = 'ABC123456';
    component.userAccount.address = '123 Main St';
    verificationService.validatePESEL.and.returnValue(true);
    verificationService.validateIdentityDocumentType.and.returnValue(true);
    verificationService.validateDocument.and.returnValue(true);
    verificationService.validateAddress.and.returnValue(true);
    component['setIsIdentityDataValid']();
    expect(verificationService.validatePESEL).toHaveBeenCalledWith(12345678901);
    expect(
      verificationService.validateIdentityDocumentType
    ).toHaveBeenCalledWith('Dowód Osobisty');
    expect(verificationService.validateDocument).toHaveBeenCalledWith(
      'ABC123456'
    );
    expect(verificationService.validateAddress).toHaveBeenCalledWith(
      '123 Main St'
    );
    expect(component.userAccountFlags.isPeselValid).toBeTrue();
    expect(component.userAccountFlags.isIdentityDocumentTypeValid).toBeTrue();
    expect(component.userAccountFlags.isIdentityDocumentSerieValid).toBeTrue();
    expect(component.userAccountFlags.isAddressValid).toBeTrue();
  });
  it('should validate password', () => {
    component.userAccount.password = 'password123';
    component.userAccount.repeatedPassword = 'password123';
    verificationService.validatePassword.and.returnValue(true);
    verificationService.validateRepeatedPassword.and.returnValue(true);
    component['setIsPasswordValid']();
    expect(verificationService.validatePassword).toHaveBeenCalledWith(
      'password123'
    );
    expect(verificationService.validateRepeatedPassword).toHaveBeenCalledWith(
      'password123',
      'password123'
    );
    expect(component.userAccountFlags.isPasswordValid).toBeTrue();
    expect(component.userAccountFlags.isRepeatedPasswordValid).toBeTrue();
  });
  it('should validate account data', () => {
    component.account.currency = 'PLN';
    component.account.type = 'Konto osobiste';
    verificationService.validateAccountCurrency.and.returnValue(true);
    verificationService.validateAccountType.and.returnValue(true);
    component['setIsAccountDataValid']();
    expect(verificationService.validateAccountCurrency).toHaveBeenCalledWith(
      'PLN'
    );
    expect(verificationService.validateAccountType).toHaveBeenCalledWith(
      'Konto osobiste'
    );
    expect(component.userAccountFlags.isAccountCurrencyValid).toBeTrue();
    expect(component.userAccountFlags.isAccountTypeValid).toBeTrue();
  });
  it('should return validation flags', () => {
    component.userAccountFlags = {
      isEmailValid: true,
      isPhoneNumberValid: true,
      isNameValid: true,
      isSurnameValid: true,
      isPeselValid: true,
      isIdentityDocumentTypeValid: true,
      isIdentityDocumentSerieValid: true,
      isAddressValid: true,
      isPasswordValid: true,
      isRepeatedPasswordValid: true,
      isAccountCurrencyValid: true,
      isAccountTypeValid: true,
      isIdentifierValid: true,
      isAvatarValid: true,
    };
    const flags = component['validationFlags'];
    expect(flags).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});
