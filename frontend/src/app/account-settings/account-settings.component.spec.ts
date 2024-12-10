import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AvatarService } from '../../services/avatar.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { AccountSettingsComponent } from './account-settings.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAvatarService: jasmine.SpyObj<AvatarService>;
  let mockShakeStateService: jasmine.SpyObj<ShakeStateService>;
  let mockVerificationService: jasmine.SpyObj<VerificationService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj(
      'UserService',
      ['getIsUserNotExists', 'sendVerificationEmail', 'setEditingUserAccount'],
      {
        actualUserAccount: of({
          firstName: 'John',
          lastName: 'Doe',
          emailAddress: 'john.doe@example.com',
          phoneNumber: '1234567890',
          address: '123 Main St',
          avatarUrl: 'avatar.png',
          password: '',
          repeatedPassword: '',
        }),
        userAccount: {
          firstName: 'John',
          lastName: 'Doe',
          emailAddress: 'john.doe@example.com',
          phoneNumber: '1234567890',
          address: '123 Main St',
          avatarUrl: 'avatar.png',
          password: '',
          repeatedPassword: '',
        },
      }
    );
    mockAvatarService = jasmine.createSpyObj(
      'AvatarService',
      ['setTemporaryAvatarUrl', 'setTemporaryAvatarError', 'getInitials'],
      {
        currentTemporaryAvatarUrl: of('http://example.com/avatar.png'),
      }
    );
    mockShakeStateService = jasmine.createSpyObj('ShakeStateService', [
      'setCurrentShakeState',
    ]);
    mockVerificationService = jasmine.createSpyObj('VerificationService', [
      'validateFirstName',
      'validateLastName',
      'validateEmail',
      'validatePhoneNumber',
      'validateAddress',
      'validatePassword',
      'validateSelectedAvatarType',
      'validateSelectedAvatarSize',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AvatarService, useValue: mockAvatarService },
        { provide: ShakeStateService, useValue: mockShakeStateService },
        { provide: VerificationService, useValue: mockVerificationService },
      ],
      imports: [FormsModule, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate phone number correctly', () => {
    component.userObject.phoneNumber = 1234567890;
    component.validatePhoneNumber();
    expect(mockVerificationService.validatePhoneNumber).toHaveBeenCalledWith(
      String(1234567890)
    );
  });

  it('should validate email correctly', () => {
    component.userObject.emailAddress = 'john.doe@example.com';
    component.validateEmail();
    expect(mockVerificationService.validateEmail).toHaveBeenCalledWith(
      'john.doe@example.com'
    );
  });

  it('should subscribe to avatar URL changes on init', () => {
    component.ngOnInit();
    expect(component.currentAvatarUrl).toBe('http://example.com/avatar.png');
  });

  it('should handle save button click correctly', async () => {
    component.userAccountFlags.isRepeatedPasswordValid = true;
    component.userAccountFlags.isPasswordValid = true;
    component.userAccountFlags.isAvatarValid = true;
    await component.handleSaveButtonClick();
    expect(component.isNotDataChanged).toBeFalse();
  });
});
