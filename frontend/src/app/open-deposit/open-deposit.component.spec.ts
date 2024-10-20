import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { OpenDepositComponent } from './open-deposit.component';
import { OpenDepositModule } from './open-deposit.module';

describe('OpenDepositComponent', () => {
  let component: OpenDepositComponent;
  let fixture: ComponentFixture<OpenDepositComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserAccountsArray',
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getMonths',
      'getMonthForm',
      'getCalculatedAmount',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', [
      'setPaginatedArray',
      'handleWidthChange',
      'onResize',
    ]);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateSelectedAccount',
      'validateInput',
    ]);
    await TestBed.configureTestingModule({
      imports: [FormsModule, MatIconModule, OpenDepositModule],
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
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    paginationService = TestBed.inject(
      PaginationService
    ) as jasmine.SpyObj<PaginationService>;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set deposit end date correctly', () => {
    const mockDuration = 6;
    component.deposit.duration = mockDuration;
    const mockMonths = 6;
    convertService.getMonths.and.returnValue(mockMonths);
    component.setDepositEndDate();
    const expectedDate = new Date();
    expectedDate.setUTCMonth(expectedDate.getUTCMonth() + mockMonths);
    const expectedEndDate = expectedDate.toISOString().split('T')[0];
    expect(component.deposit.endDate).toBe(expectedEndDate);
  });
  it('should validate account number correctly', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        currency: 'USD',
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.userAccounts = mockAccounts;
    const mockEvent = { target: { value: '1' } } as unknown as Event;
    verificationService.validateSelectedAccount.and.returnValue(true);
    component.setDepositAccountNumber(mockEvent);
    expect(component.isAccountNumberValid).toBeTrue();
    expect(component.deposit.assignedAccountNumber).toBe('1');
  });
  it('should return value with currency', () => {
    const mockMultiplier = 100;
    const mockLimit = 1000;
    const mockCurrency = 'USD';
    convertService.getCalculatedAmount.and.returnValue(mockLimit);
    spyOnProperty(component, 'currentCurrency', 'get').and.returnValue(
      mockCurrency
    );
    const result = component.getValueWithCurrency(mockMultiplier);
    expect(result).toBe(`${mockLimit} ${mockCurrency}`);
  });
  it('should return months description', () => {
    const mockDuration = 6;
    const mockMonths = 6;
    const mockMonthForm = 'months';
    component.deposit.duration = mockDuration;
    convertService.getMonths.and.returnValue(mockMonths);
    convertService.getMonthForm.and.returnValue(mockMonthForm);
    const result = component.monthsDescription;
    expect(result).toBe(`${mockMonths} ${mockMonthForm}`);
  });
  it('should return current currency', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        currency: 'USD',
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.userAccounts = mockAccounts;
    component.deposit.assignedAccountNumber = '1';
    const result = component.currentCurrency;
    expect(result).toBe('USD');
  });
  it('should validate initial capital input', () => {
    const mockNgModel = {} as NgModel;
    verificationService.validateInput.and.returnValue(false);
    const result = component.getIsInitialCapitalValid(mockNgModel);
    expect(result).toBeTrue();
    expect(component.isInitialCapitalValid).toBeTrue();
  });
  it('should return actual account', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        currency: 'USD',
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.userAccounts = mockAccounts;
    component.deposit.assignedAccountNumber = '1';
    const result = component['getActualAccount']();
    expect(result).toEqual(mockAccounts[0]);
  });
});
