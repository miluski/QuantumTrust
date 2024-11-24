import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { of } from 'rxjs';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';
import { CardSettingsComponent } from './card-settings.component';

describe('CardSettingsComponent', () => {
  let component: CardSettingsComponent;
  let fixture: ComponentFixture<CardSettingsComponent>;
  let itemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let userService: jasmine.SpyObj<UserService>;
  let filtersService: jasmine.SpyObj<FiltersService>;
  let convertService: jasmine.SpyObj<ConvertService>;

  beforeEach(async () => {
    const itemSelectionServiceSpy = jasmine.createSpyObj('ItemSelectionService', [
      'currentCard',
      'isAccountIdAssignedToCardEqualToItemId',
      'isTransactionAccountIdEqualToItemId',
    ]);
    const appInformationStatesServiceSpy = jasmine.createSpyObj('AppInformationStatesService', ['changeTransactionsArrayLength']);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', ['validateSelectedAccount', 'validateInput']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['userTransactions', 'userAccounts']);
    const filtersServiceSpy = jasmine.createSpyObj('FiltersService', ['resetSelectedFilters', 'sortByDate', 'setOriginalTransactionsArray']);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', ['getTransactionsLimit', 'getGroupedUserTransactions']);

    userServiceSpy.userAccounts = of([{} as Account]);
    userServiceSpy.userTransactions = of([{} as Transaction]);

    await TestBed.configureTestingModule({
      declarations: [CardSettingsComponent],
      imports: [FormsModule],
      providers: [
        { provide: ItemSelectionService, useValue: itemSelectionServiceSpy },
        { provide: AppInformationStatesService, useValue: appInformationStatesServiceSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: FiltersService, useValue: filtersServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        ShakeStateService,
        AnimationsProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSettingsComponent);
    component = fixture.componentInstance;
    itemSelectionService = TestBed.inject(ItemSelectionService) as jasmine.SpyObj<ItemSelectionService>;
    appInformationStatesService = TestBed.inject(AppInformationStatesService) as jasmine.SpyObj<AppInformationStatesService>;
    verificationService = TestBed.inject(VerificationService) as jasmine.SpyObj<VerificationService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    filtersService = TestBed.inject(FiltersService) as jasmine.SpyObj<FiltersService>;
    convertService = TestBed.inject(ConvertService) as jasmine.SpyObj<ConvertService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize card transactions on init', () => {
    spyOn(component, 'initializeCardTransactions');
    component.ngOnInit();
    expect(component.initializeCardTransactions).toHaveBeenCalled();
  });

  it('should set user accounts', () => {
    const accounts: Account[] = [new Account()];
    userService.userAccounts = of(accounts);
    component.setUserAccounts();
    expect(component.userAccounts).toEqual(accounts);
  });

  it('should validate input value', () => {
    const input = { valid: false } as NgModel;
    const isValid = component.getIsInputValueValid(input, 'cash');
    expect(isValid).toBeTrue();
  });

  it('should handle save button click', () => {
    spyOn(component, 'isSomeCardDataChanged').and.returnValue(true);
    spyOn(component.shakeStateService, 'setCurrentShakeState');
    component.handleSaveButtonClick();
    expect(component.shakeStateService.setCurrentShakeState).toHaveBeenCalledWith('none');
  });

  it('should check if some card data has changed', () => {
    spyOn(component, 'isAccountIdChanged').and.returnValue(true);
    const result = component.isSomeCardDataChanged();
    expect(result).toBeTrue();
  });

  it('should check if account ID has changed', () => {
    component.cardSettings = { assignedAccountNumber: '123' } as any;
    component.originalCard = { assignedAccountNumber: '456' } as any;
    const result = component.isAccountIdChanged();
    expect(result).toBeTrue();
  });

  it('should check if cash transactions limit has changed', () => {
    component.cardSettings = { limits: { cashTransactionsLimit: 100 } } as any;
    convertService.getTransactionsLimit.and.returnValue(50);
    const result = component.isCashTransactionsLimitChanged();
    expect(result).toBeTrue();
  });

  it('should check if internet transactions limit has changed', () => {
    component.cardSettings = { limits: { internetTransactionsLimit: 100 } } as any;
    convertService.getTransactionsLimit.and.returnValue(50);
    const result = component.isInternetTransactionsLimitChanged();
    expect(result).toBeTrue();
  });

  it('should get founded account', () => {
    const account = new Account();
    account.id = '123';
    component.userAccounts = [account];
    const result = component.getFoundedAccount('123');
    expect(result).toEqual(account);
  });

  it('should set correct input flag', () => {
    component.setCorrectInputFlag('cash', true);
    expect(component.cardFlags.isCashTransactionsLimitValid).toBeTrue();
  });
});