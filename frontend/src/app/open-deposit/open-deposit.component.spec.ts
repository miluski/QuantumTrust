import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { of } from 'rxjs';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { OpenDepositComponent } from './open-deposit.component';
import { MatIconModule } from '@angular/material/icon';
import { Account } from '../../types/account';
import { Deposit } from '../../types/deposit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OpenDepositComponent', () => {
  let component: OpenDepositComponent;
  let fixture: ComponentFixture<OpenDepositComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  let verificationService: jasmine.SpyObj<VerificationService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserAccountsArray']);
    userServiceSpy.userAccounts = of([new Account()]);

    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getMonths',
      'getMonthForm',
      'getCalculatedAmount',
      'getPolishDepositType',
      'getDepositIcon',
      'getAccountOptionString'
    ]);

    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', [
      'setPaginatedArray',
      'handleWidthChange',
      'onResize',
      'paginatedItems',
    ]);

    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateSelectedAccount',
      'validateInput',
    ]);

    paginationServiceSpy.paginatedItems = [{
      type: ''
    }];

    await TestBed.configureTestingModule({
      declarations: [OpenDepositComponent],
      imports: [FormsModule, MatIconModule, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        ShakeStateService,
        AnimationsProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenDepositComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    convertService = TestBed.inject(ConvertService) as jasmine.SpyObj<ConvertService>;
    paginationService = TestBed.inject(PaginationService) as jasmine.SpyObj<PaginationService>;
    verificationService = TestBed.inject(VerificationService) as jasmine.SpyObj<VerificationService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set deposit end date correctly', () => {
    convertService.getMonths.and.returnValue(6);
    component.deposit = new Deposit();
    component.deposit.duration = 6;
    component.setDepositEndDate();
    const expectedDate = new Date();
    expectedDate.setUTCMonth(expectedDate.getUTCMonth() + 6);
    expect(component.deposit.endDate).toBe(
      expectedDate.toISOString().split('T')[0]
    );
  });

  it('should validate account number correctly', () => {
    verificationService.validateSelectedAccount.and.returnValue(true);
    const event = { target: { value: '1' } } as unknown as Event;
    component.setDepositAccountNumber(event);
    expect(component.isAccountNumberValid).toBeTrue();
    expect(component.deposit.assignedAccountNumber).toBe('1');
  });

  it('should get value with currency correctly', () => {
    convertService.getCalculatedAmount.and.returnValue(1000);
    component.deposit = new Deposit();
    component.deposit.balance = 0;
    const valueWithCurrency = component.getValueWithCurrency(100);
    expect(valueWithCurrency).toBe('1000 PLN');
    expect(component.deposit.balance).toBe(1000);
  });

  it('should validate initial capital correctly', () => {
    verificationService.validateInput.and.returnValue(false);
    const initialCapitalInput = {} as NgModel;
    const isValid = component.getIsInitialCapitalValid(initialCapitalInput);
    expect(isValid).toBeTrue();
    expect(component.isInitialCapitalValid).toBeTrue();
  });

  it('should return correct months description', () => {
    convertService.getMonths.and.returnValue(6);
    convertService.getMonthForm.and.returnValue('months');
    component.deposit = new Deposit();
    component.deposit.duration = 6;
    expect(component.monthsDescription).toBe('6 months');
  });
});