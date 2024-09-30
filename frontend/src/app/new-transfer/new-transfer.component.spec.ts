import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';
import { NewTransferComponent } from './new-transfer.component';

describe('NewTransferComponent', () => {
  let component: NewTransferComponent;
  let fixture: ComponentFixture<NewTransferComponent>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserAccountsArray',
    ]);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateOperationAmount',
      'validateTransferTitle',
      'validateReceiverAccountId',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj(
      'PaginationService',
      ['onResize', 'setPaginatedArray', 'handleWidthChange'],
      {
        paginatedItems: [
          { id: '1', balance: 1000 },
          { id: '2', balance: 2000 },
        ],
      }
    );
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getPolishAccountType',
      'getNumberWithSpacesBetweenThousands',
      'getShortenedAccountId',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        VerificationCodeComponent,
        NewTransferComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        AnimationsProvider,
        { provide: UserService, useValue: userServiceSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        ShakeStateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(NewTransferComponent);
    component = fixture.componentInstance;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
    paginationService = TestBed.inject(
      PaginationService
    ) as jasmine.SpyObj<PaginationService>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate receiver account number', () => {
    const mockAccounts: Account[] = [
      {
        id: '2',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.transferReceiverAccountId = '12345';
    paginationService.setPaginatedArray(mockAccounts);
    verificationService.validateReceiverAccountId.and.returnValue(true);
    component['setsTransferReceiverAccountNumberValid']();
    expect(verificationService.validateReceiverAccountId).toHaveBeenCalledWith(
      '12345',
      '2'
    );
    expect(
      component.transferFlags.isTransferReceiverAccountNumberValid
    ).toBeTrue();
  });
  it('should validate transfer amount', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.transferAmount = 500;
    Object.defineProperty(component, 'currentSelectedAccount', {
      value: mockAccounts[0],
    });
    paginationService.setPaginatedArray(mockAccounts);
    verificationService.validateOperationAmount.and.returnValue(true);
    component['setIsTransferAmountValid']();
    expect(component.transferFlags.isTransferAmountValid).toBeTrue();
  });
  it('should return the current transfer amount', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    Object.defineProperty(component, 'currentSelectedAccount', {
      value: mockAccounts[0],
    });
    paginationService.setPaginatedArray(mockAccounts);
    const transferAmount = component.currentTransferAmount;
    expect(transferAmount).toBe(1);
  });
  it('should return the current selected account', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    Object.defineProperty(component, 'currentSelectedAccount', {
      value: mockAccounts[0],
    });
    paginationService.setPaginatedArray(mockAccounts);
    const selectedAccount = component.currentSelectedAccount;
    expect(selectedAccount).toEqual(mockAccounts[0]);
  });
  it('should validate fields and set shake state on button click', () => {
    const mockAccounts: Account[] = [
      {
        id: '67890',
        balance: 1000,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.transferReceiverAccountId = '12345';
    paginationService.setPaginatedArray(mockAccounts);
    verificationService.validateReceiverAccountId.and.returnValue(true);
    component.handleButtonClick();
    expect(
      component.transferFlags.isTransferReceiverAccountNumberValid
    ).toBeTrue();
  });
});
