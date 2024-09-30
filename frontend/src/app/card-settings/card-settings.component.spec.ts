import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { CardSettings } from '../../types/card-settings';
import { Transaction } from '../../types/transaction';
import { CardSettingsComponent } from './card-settings.component';

describe('CardSettingsComponent', () => {
  let component: CardSettingsComponent;
  let fixture: ComponentFixture<CardSettingsComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let itemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let filtersService: jasmine.SpyObj<FiltersService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserAccountsArray',
    ]);
    const itemSelectionServiceSpy = jasmine.createSpyObj(
      'ItemSelectionService',
      ['currentCard', 'getUserTransactions']
    );
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTransactionsArrayLength']
    );
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateSelectedAccount',
      'validateInput',
    ]);
    const filtersServiceSpy = jasmine.createSpyObj('FiltersService', [
      'sortByDate',
      'setOriginalTransactionsArray',
      'resetSelectedFilters'
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getTransactionsLimit',
      'getGroupedUserTransactions',
    ]);
    await TestBed.configureTestingModule({
      imports: [FormsModule, CardSettingsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ItemSelectionService, useValue: itemSelectionServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: FiltersService, useValue: filtersServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        ShakeStateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CardSettingsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    itemSelectionService = TestBed.inject(
      ItemSelectionService
    ) as jasmine.SpyObj<ItemSelectionService>;
    appInformationStatesService = TestBed.inject(
      AppInformationStatesService
    ) as jasmine.SpyObj<AppInformationStatesService>;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
    filtersService = TestBed.inject(
      FiltersService
    ) as jasmine.SpyObj<FiltersService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    component.originalCard = new Card();
    component.cardSettings = {
      limits: {},
      assignedAccountNumber: '2',
    } as CardSettings;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize card transactions on init', async () => {
    const card: Card = {
      id: '1',
      assignedAccountId: '1',
      limits: [{ internetTransactions: [1000], cashTransactions: [500] }],
    } as unknown as Card;
    itemSelectionService.currentCard = of(card);
    itemSelectionService.getUserTransactions.and.returnValue(
      Promise.resolve([])
    );
    userService.getUserAccountsArray.and.returnValue(Promise.resolve([]));
    component.ngOnInit();
    expect(component.card).toEqual(card);
    expect(component.originalCard).toEqual(card);
    expect(component.cardSettings.limits.internetTransactionsLimit).toEqual(
      1000
    );
    expect(component.cardSettings.limits.cashTransactionsLimit).toEqual(500);
  });
  it('should set user accounts', async () => {
    const accounts: Account[] = [{ id: '1', currency: 'USD' }] as Account[];
    userService.getUserAccountsArray.and.returnValue(Promise.resolve(accounts));
    await component.setUserAccounts();
    expect(component.userAccounts).toEqual(accounts);
    expect(component.currentSelectedAccount).toEqual(accounts[0]);
    expect(component.currentSelectedAccountId).toEqual('1');
  });
  it('should validate input value', () => {
    const input = { valid: true } as NgModel;
    verificationService.validateInput.and.returnValue(true);
    const isValid = component.getIsInputValueValid(input, 'cash');
    expect(isValid).toBeFalse();
    expect(component.cardFlags.isCashTransactionsLimitValid).toBeFalse();
  });
  it('should handle save button click', () => {
    spyOn(component, 'isSomeCardDataChanged').and.returnValue(false);
    component.cardFlags.isAccountNumberValid = false;
    component.handleSaveButtonClick();
    expect(component.shakeStateService.shakeState).toBe('shake');
  });
  it('should check if some card data has changed', () => {
    spyOn(component, 'isAccountIdChanged').and.returnValue(true);
    const result = component.isSomeCardDataChanged();
    expect(result).toBeTrue();
  });
  it('should check if account ID has changed', () => {
    component.cardSettings.assignedAccountNumber = '2';
    component.originalCard.assignedAccountId = '1';
    const result = component.isAccountIdChanged();
    expect(result).toBeTrue();
  });
  it('should check if cash transactions limit has changed', () => {
    component.cardSettings.limits.cashTransactionsLimit = 1000;
    component.originalCard.limits = [{ cashTransactions: [500] }] as any;
    convertService.getTransactionsLimit.and.returnValue(500);
    const result = component.isCashTransactionsLimitChanged();
    expect(result).toBeTrue();
  });
  it('should check if internet transactions limit has changed', () => {
    component.cardSettings.limits.internetTransactionsLimit = 1000;
    component.originalCard.limits = [{ internetTransactions: [500] }] as any;
    convertService.getTransactionsLimit.and.returnValue(500);
    const result = component.isInternetTransactionsLimitChanged();
    expect(result).toBeTrue();
  });
  it('should set transactions', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 100 },
    ] as unknown as Transaction[];
    component.accountTransactions = transactions;
    convertService.getGroupedUserTransactions.and.returnValue([
      [transactions[0]],
    ]);
    component.setTransactions();
    expect(component.dailyTransactions).toEqual([[transactions[0]]]);
    expect(filtersService.sortByDate).toHaveBeenCalledWith(
      [[transactions[0]]],
      'asc'
    );
    expect(filtersService.setOriginalTransactionsArray).toHaveBeenCalledWith([
      [transactions[0]],
    ]);
    expect(
      appInformationStatesService.changeTransactionsArrayLength
    ).toHaveBeenCalledWith(transactions.length);
  });
});
