import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { VerificationCodeComponent } from './verification-code.component';

describe('VerificationCodeComponent', () => {
  let component: VerificationCodeComponent;
  let fixture: ComponentFixture<VerificationCodeComponent>;
  let mockRouter: any;
  let mockVerificationService: any;
  let mockAppInformationStatesService: any;
  let mockAlertService: any;
  beforeEach(async () => {
    mockRouter = {
      url: '/main-page',
      events: of({}),
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      createUrlTree: jasmine.createSpy('createUrlTree'),
      serializeUrl: jasmine.createSpy('serializeUrl'),
    };
    mockVerificationService = {
      validateVerificationCode: jasmine
        .createSpy('validateVerificationCode')
        .and.returnValue(true),
    };
    mockAppInformationStatesService = {
      changeTabName: jasmine.createSpy('changeTabName'),
    };
    mockAlertService = {
      progressValue: 0,
      alertType: '',
      alertTitle: '',
      alertContent: '',
      show: jasmine.createSpy('show'),
    };
    await TestBed.configureTestingModule({
      imports: [VerificationCodeComponent, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: VerificationService, useValue: mockVerificationService },
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ActivatedRoute, useValue: {} },
        ShakeStateService,
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate verification code and navigate on handleButtonClick', () => {
    component.actionType = 'Logowanie';
    component.verificationCode = 123456;
    component.handleButtonClick();
    expect(
      mockVerificationService.validateVerificationCode
    ).toHaveBeenCalledWith(123456);
    expect(mockAlertService.progressValue).toBe(100);
    expect(mockAlertService.show).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/main-page');
  });
  it('should set shake state if verification code is invalid', () => {
    mockVerificationService.validateVerificationCode.and.returnValue(false);
    component.verificationCode = 123456;
    component.handleButtonClick();
    expect(component.shakeStateService.shakeState).toBe('shake');
  });
  it('should change tab name on handleRedirectButtonClick', () => {
    component.actionType = 'Otwieranie konta';
    mockRouter.url = '/main-page';
    component.handleRedirectButtonClick();
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });
  it('should return correct redirectText based on actionType', () => {
    component.actionType = 'Logowanie';
    expect(component.redirectText).toBe('Załóż je!');
    component.actionType = 'Otwieranie konta';
    mockRouter.url = '/main-page';
    expect(component.redirectText).toBe('Powrót do finansów!');
  });
  it('should return correct redirectLink based on actionType', () => {
    component.actionType = 'Logowanie';
    expect(component.redirectLink).toBe('/open-account');
    component.actionType = 'Otwieranie konta';
    mockRouter.url = '/main-page';
    expect(component.redirectLink).toBe('/main-page');
  });
  it('should return correct buttonText based on actionType', () => {
    component.actionType = 'Logowanie';
    expect(component.buttonText).toBe('Zaloguj się');
    component.actionType = 'Otwieranie konta';
    expect(component.buttonText).toBe('Otwórz konto');
  });
  it('should return correct ask text based on actionType', () => {
    component.actionType = 'Logowanie';
    expect(component.ask).toBe('Nie masz konta?');
    component.actionType = 'Otwieranie konta';
    mockRouter.url = '/main-page';
    expect(component.ask).toBe('Zabłądziłeś?');
  });
  it('should set alert credentials correctly', () => {
    component.actionType = 'Logowanie';
    component.setAlertCredentials('info', 'Sukces!', 'positive');
    expect(mockAlertService.alertType).toBe('info');
    expect(mockAlertService.alertTitle).toBe('Sukces!');
    expect(mockAlertService.alertContent).toBe('Pomyślnie zalogowano!');
  });
  it('should change tab name correctly', () => {
    component.changeTabName('Finanse');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });
});
