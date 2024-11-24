import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';
import { DurationExpansionModule } from '../duration-expansion/duration-expansion.module';
import { MobileFiltersModule } from '../mobile-filters/mobile-filters.module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { SingleAccountBalanceChartModule } from '../single-account-balance-chart/single-account-balance-chart.module';
import { SortExpansionModule } from '../sort-expansion/sort-expansion.module';
import { StatusExpansionModule } from '../status-expansion/status-expansion.module';
import { SingleAccountTransactionsComponent } from './single-account-transactions.component';

describe('SingleAccountTransactionsComponent', () => {
  let component: SingleAccountTransactionsComponent;
  let fixture: ComponentFixture<SingleAccountTransactionsComponent>;
  let mockAppInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let mockConvertService: jasmine.SpyObj<ConvertService>;
  let mockFiltersService: jasmine.SpyObj<FiltersService>;
  let mockItemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockAppInformationStatesService = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTransactionsArrayLength']
    );
    mockConvertService = jasmine.createSpyObj('ConvertService', [
      'getConversionRate',
      'getGroupedUserTransactions',
      'getPolishAccountType',
      'getNumberWithSpacesBetweenThousands',
    ]);
    mockFiltersService = jasmine.createSpyObj(
      'FiltersService',
      ['resetSelectedFilters', 'sortByDate', 'setOriginalTransactionsArray'],
      {
        currentExpansionFlagsArray: of([]),
        currentIsMobileFiltersOpened: of([]),
      }
    );
    mockItemSelectionService = jasmine.createSpyObj(
      'ItemSelectionService',
      [
        'isAccountIdAssignedToCardEqualToItemId',
        'isTransactionAccountIdEqualToItemId',
      ],
      { currentAccount: of(new Account()) }
    );
    mockUserService = jasmine.createSpyObj('UserService', [], {
      userTransactions: of([]),
    });

    await TestBed.configureTestingModule({
      imports: [
        SingleAccountBalanceChartModule,
        SortExpansionModule,
        DurationExpansionModule,
        StatusExpansionModule,
        SearchBarModule,
        MobileFiltersModule,
      ],
      declarations: [SingleAccountTransactionsComponent],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: ConvertService, useValue: mockConvertService },
        { provide: FiltersService, useValue: mockFiltersService },
        { provide: ItemSelectionService, useValue: mockItemSelectionService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize account transactions on init', () => {
    spyOn(component, 'initializeAccountTransactions');
    component.ngOnInit();
    expect(component.initializeAccountTransactions).toHaveBeenCalled();
  });

  it('should reset selected filters on init', () => {
    component.ngOnInit();
    expect(mockFiltersService.resetSelectedFilters).toHaveBeenCalled();
  });

  it('should calculate total incoming balance', () => {
    const transaction: Transaction = {
      id: 1,
      type: 'incoming',
      status: 'settled',
      amount: 100,
      currency: 'USD',
      date: '',
      hour: '',
      title: '',
      assignedAccountNumber: '',
      category: '',
      accountAmountAfter: 0,
      accountCurrency: '',
    };
    mockConvertService.getConversionRate.and.returnValue(1);
    component.calculateTotalIncomingBalance(transaction);
    expect(component.totalIncomingBalance).toBe(100);
  });

  it('should calculate total outgoing balance', () => {
    const transaction: Transaction = {
      id: 1,
      type: 'outgoing',
      status: 'settled',
      amount: 50,
      currency: 'USD',
      date: '',
      hour: '',
      title: '',
      assignedAccountNumber: '',
      category: '',
      accountAmountAfter: 0,
      accountCurrency: '',
    };
    mockConvertService.getConversionRate.and.returnValue(1);
    component.calculateTotalOutgoingBalance(transaction);
    expect(component.totalOutgoingBalance).toBe(50);
  });

  it('should convert currency', () => {
    mockConvertService.getConversionRate.and.returnValue(0.85);
    const convertedAmount = component.convertCurrency(100, 'USD', 'EUR');
    expect(convertedAmount).toBe(85);
  });

  it('should set transactions details', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        type: 'incoming',
        status: 'settled',
        amount: 100,
        currency: 'USD',
        date: '',
        hour: '',
        title: '',
        assignedAccountNumber: '',
        category: '',
        accountAmountAfter: 0,
        accountCurrency: '',
      },
      {
        id: 2,
        type: 'outgoing',
        status: 'settled',
        amount: 50,
        currency: 'USD',
        date: '',
        hour: '',
        title: '',
        assignedAccountNumber: '',
        category: '',
        accountAmountAfter: 0,
        accountCurrency: '',
      },
    ];
    component.accountTransactions = transactions;
    mockConvertService.getGroupedUserTransactions.and.returnValue([
      transactions,
    ]);
    component.setTransactionsDetails();
    expect(component.dailyTransactions.length).toBe(1);
    expect(mockFiltersService.sortByDate).toHaveBeenCalled();
    expect(mockFiltersService.setOriginalTransactionsArray).toHaveBeenCalled();
    expect(
      mockAppInformationStatesService.changeTransactionsArrayLength
    ).toHaveBeenCalledWith(2);
  });
});
