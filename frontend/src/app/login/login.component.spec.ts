import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let alertService: jasmine.SpyObj<AlertService>;
  beforeEach(async () => {
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateIdentifier',
      'validatePassword',
    ]);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        CommonModule,
        FormsModule,
        RouterModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        HeaderComponent,
        FooterComponent,
        VerificationCodeComponent,
        CustomAlertComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
        ShakeStateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate identifier and password on verifyData call', () => {
    component.userAccount.identifier = 1;
    component.userAccount.password = 'testPassword';
    verificationService.validateIdentifier.and.returnValue(true);
    verificationService.validatePassword.and.returnValue(true);
    component.verifyData();
    expect(verificationService.validateIdentifier).toHaveBeenCalledWith(1);
    expect(verificationService.validatePassword).toHaveBeenCalledWith(
      'testPassword'
    );
    expect(component.userAccountFlags.isIdentifierValid).toBeTrue();
    expect(component.userAccountFlags.isPasswordValid).toBeTrue();
  });
  it('should set shake state based on validation flags', () => {
    component.userAccountFlags.isIdentifierValid = true;
    component.userAccountFlags.isPasswordValid = true;
    component.verifyData();
    expect(component.shakeStateService.shakeState).toBe('none');
  });
});
