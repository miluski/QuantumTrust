import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { NewTransferComponent } from './new-transfer.component';

describe('NewTransferComponent', () => {
  let component: NewTransferComponent;
  let fixture: ComponentFixture<NewTransferComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  let shakeStateService: jasmine.SpyObj<ShakeStateService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'setTransferObject',
      'getIsAccountExists',
    ]);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateOperationAmount',
      'validateTransferTitle',
      'validateReceiverAccountId',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', [
      'setPaginatedArray',
      'handleWidthChange',
    ]);
    const shakeStateServiceSpy = jasmine.createSpyObj('ShakeStateService', [
      'setCurrentShakeState',
    ]);

    await TestBed.configureTestingModule({
      declarations: [NewTransferComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: ShakeStateService, useValue: shakeStateServiceSpy },
        ConvertService,
      ],
      imports: [MatIconModule, FormsModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTransferComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
    paginationService = TestBed.inject(
      PaginationService
    ) as jasmine.SpyObj<PaginationService>;
    shakeStateService = TestBed.inject(
      ShakeStateService
    ) as jasmine.SpyObj<ShakeStateService>;

    userService.userAccounts = of([
      {
        id: '123',
        balance: 100,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
      {
        id: '456',
        balance: 50,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ]);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set user accounts and initialize pagination', () => {
    component.setUserAccounts();

    expect(component.userAccounts.length).toBe(2);
    expect(paginationService.setPaginatedArray).toHaveBeenCalledWith([
      {
        id: '123',
        balance: 100,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
      {
        id: '456',
        balance: 50,
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ]);
  });

  it('should limit the transfer amount to the current account balance', () => {
    const mockAccount: Account = {
      id: '123',
      balance: 100,
      advertismentText: '',
      advertismentContent: '',
      image: '',
      type: '',
      benefits: [],
    };
    userService.userAccounts = of([mockAccount]);
    component.setUserAccounts();

    component.transferAmount = 150;
    component.correctTransferAmount();

    expect(component.transferAmount).toBe(0);
  });

  it('should show input if the account balance is greater than or equal to 1', () => {
    const mockAccount: Account = {
      id: '123',
      balance: 100,
      advertismentText: '',
      advertismentContent: '',
      image: '',
      type: '',
      benefits: [],
    };

    userService.userAccounts = of([mockAccount]);
    component.setUserAccounts();

    expect(component.canShowInput).toBeFalse();
  });
});
