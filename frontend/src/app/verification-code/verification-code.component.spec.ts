import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { ImageModule } from '../image/image.module';
import { VerificationCodeComponent } from './verification-code.component';

describe('VerificationCodeComponent', () => {
  let component: VerificationCodeComponent;
  let fixture: ComponentFixture<VerificationCodeComponent>;
  let router: Router;
  let verificationService: VerificationService;
  let appInformationStatesService: AppInformationStatesService;
  let alertService: AlertService;
  let userService: UserService;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', [
      'navigateByUrl',
      'navigate',
    ]);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateVerificationCode',
    ]);
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName']
    );
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['show']);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getIsCodeValid',
      'finalizeOperation',
      'logout',
    ]);

    await TestBed.configureTestingModule({
      declarations: [VerificationCodeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        ShakeStateService,
        AnimationsProvider,
      ],
      imports: [MatDividerModule, ImageModule],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationCodeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    verificationService = TestBed.inject(VerificationService);
    appInformationStatesService = TestBed.inject(AppInformationStatesService);
    alertService = TestBed.inject(AlertService);
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show positive alert and change tab name if user is logged in', () => {
    component.actionType = 'Logowanie';
    component.showPositiveAlert(true);

    expect(alertService.show).toHaveBeenCalled();
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });

  it('should show positive alert and navigate if user is not logged in', (done) => {
    component.actionType = 'Logowanie';
    component.showPositiveAlert(false);

    setTimeout(() => {
      expect(alertService.show).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/main-page');
      done();
    }, 500);
  });

  it('should show negative alert and change tab name if user is logged in', () => {
    component.showNegativeAlert(true);

    expect(alertService.show).toHaveBeenCalled();
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });

  it('should show negative alert and logout if user is not logged in', (done) => {
    component.showNegativeAlert(false);
    setTimeout(() => {
      expect(alertService.show).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('should set alert credentials correctly', () => {
    component.actionType = 'Logowanie';
    component.setAlertCredentials(
      'info',
      'Sukces!',
      'fa-circle-info',
      '#276749',
      'positive'
    );

    expect(alertService.alertType).toBe('info');
    expect(alertService.alertTitle).toBe('Sukces!');
    expect(alertService.progressBarBorderColor).toBe('#276749');
    expect(alertService.alertIcon).toBe('fa-circle-info');
    expect(alertService.alertContent).toBe('Pomyślnie zalogowano!');
  });

  it('should handle button click and show negative alert if verification code is invalid', async () => {
    component.isVerificationCodeValid = false;
    spyOn(component, 'showNegativeAlert');

    await component.handleButtonClick();

    expect(component.showNegativeAlert).toHaveBeenCalled();
  });
});
