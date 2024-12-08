import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AvatarService } from '../../services/avatar.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { AccountSettingsComponent } from './account-settings.component';
import { AccountSettingsModule } from './account-settings.module';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let mockAvatarService: jasmine.SpyObj<AvatarService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockVerificationService: jasmine.SpyObj<VerificationService>;

  beforeEach(async () => {
    mockAvatarService = jasmine.createSpyObj('AvatarService', [
      'currentTemporaryAvatarUrl',
      'setTemporaryAvatarUrl',
      'setTemporaryAvatarError',
    ]);
    mockUserService = jasmine.createSpyObj('UserService', ['userAccount']);
    mockVerificationService = jasmine.createSpyObj('VerificationService', [
      'validateFirstName',
      'validateLastName',
      'validateEmail',
      'validatePhoneNumber',
      'validateAddress',
      'validatePassword',
      'validateRepeatedPassword',
      'validateSelectedAvatarType',
      'validateSelectedAvatarSize',
    ]);

    await TestBed.configureTestingModule({
      imports: [AccountSettingsModule, BrowserAnimationsModule],
      providers: [
        { provide: AvatarService, useValue: mockAvatarService },
        { provide: UserService, useValue: mockUserService },
        { provide: VerificationService, useValue: mockVerificationService },
        ShakeStateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    mockAvatarService.currentTemporaryAvatarUrl = of('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to avatar URL changes on init', () => {
    mockAvatarService.currentTemporaryAvatarUrl = of('new-avatar-url');
    component.ngOnInit();
    expect(component.avatarUrl).toBe('new-avatar-url');
  });

  it('should validate name correctly', () => {
    component.userObject.firstName = 'Jane';
    mockVerificationService.validateFirstName.and.returnValue(true);
    component.validateName();
    expect(component.userAccountFlags.isNameValid).toBeTrue();
  });

  it('should validate surname correctly', () => {
    component.userObject.lastName = 'Smith';
    mockVerificationService.validateLastName.and.returnValue(true);
    component.validateSurname();
    expect(component.userAccountFlags.isSurnameValid).toBeTrue();
  });

  it('should validate email correctly', () => {
    component.userObject.emailAddress = 'jane.smith@example.com';
    mockVerificationService.validateEmail.and.returnValue(true);
    component.validateEmail();
    expect(component.userAccountFlags.isEmailValid).toBeTrue();
  });

  it('should validate phone number correctly', () => {
    component.userObject.phoneNumber = 987654321;
    mockVerificationService.validatePhoneNumber.and.returnValue(true);
    component.validatePhoneNumber();
    expect(component.userAccountFlags.isPhoneNumberValid).toBeTrue();
  });

  it('should validate address correctly', () => {
    component.userObject.address = '456 Another St';
    mockVerificationService.validateAddress.and.returnValue(true);
    component.validateAddress();
    expect(component.userAccountFlags.isAddressValid).toBeTrue();
  });

  it('should validate password correctly', () => {
    component.newPassword = 'newpassword';
    component.userObject.password = 'newpassword';
    mockVerificationService.validatePassword.and.returnValue(true);
    component.validateNewPassword();
    expect(component.userAccountFlags.isPasswordValid).toBeTrue();
  });

  it('should validate repeated password correctly', () => {
    component.newPassword = 'newpassword';
    component.userObject.repeatedPassword = 'newpassword';
    mockVerificationService.validatePassword.and.returnValue(true);
    component.validateRepeatedPassword();
    expect(component.userAccountFlags.isRepeatedPasswordValid).toBeTrue();
  });

  it('should handle file selection correctly', () => {
    const file = new Blob(['avatar'], { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    mockVerificationService.validateSelectedAvatarType.and.returnValue(true);
    mockVerificationService.validateSelectedAvatarSize.and.returnValue(true);
    component.onFileSelected(event);
    expect(component.userAccountFlags.isAvatarValid).toBeTrue();
  });

  it('should handle save button click correctly', () => {
    spyOn<any>(component, 'isSomeDataNotEqualWithOriginal').and.returnValue(
      true
    );
    component.userAccountFlags.isEmailValid = true;
    component.userAccountFlags.isPhoneNumberValid = true;
    component.userAccountFlags.isNameValid = true;
    component.userAccountFlags.isSurnameValid = true;
    component.userAccountFlags.isAddressValid = true;
    component.userAccountFlags.isRepeatedPasswordValid = true;
    component.userAccountFlags.isPasswordValid = true;
    component.userAccountFlags.isAvatarValid = true;
    component.handleSaveButtonClick();
    expect(component.isNotDataChanged).toBeFalse();
  });
});
