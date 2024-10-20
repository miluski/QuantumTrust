import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';
import { SingleAccountTransactionsComponent } from './single-account-transactions.component';
import { SingleAccountTransactionsModule } from './single-account-transactions.module';

describe('SingleAccountTransactionsComponent', () => {
  let component: SingleAccountTransactionsComponent;
  let fixture: ComponentFixture<SingleAccountTransactionsComponent>;
  let itemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  let filtersService: jasmine.SpyObj<FiltersService>;
  beforeEach(async () => {
    const itemSelectionServiceSpy = jasmine.createSpyObj(
      'ItemSelectionService',
      ['currentAccount', 'getUserTransactions']
    );
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTransactionsArrayLength']
    );
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getGroupedUserTransactions',
      'getConversionRate',
      'getPolishAccountType',
      'getNumberWithSpacesBetweenThousands',
    ]);
    const filtersServiceSpy = jasmine.createSpyObj(
      'FiltersService',
      ['sortByDate', 'setOriginalTransactionsArray', 'resetSelectedFilters'],
      {
        currentIsMobileFiltersOpened: of(true),
        currentExpansionFlagsArray: of([false]),
        actualSelectedFilters: ['Domyślnie'],
      }
    );
    await TestBed.configureTestingModule({
      imports: [SingleAccountTransactionsModule],
      providers: [
        { provide: ItemSelectionService, useValue: itemSelectionServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ConvertService, useValue: convertServiceSpy },
        { provide: FiltersService, useValue: filtersServiceSpy },
        ChangeDetectorRef,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SingleAccountTransactionsComponent);
    component = fixture.componentInstance;
    itemSelectionService = TestBed.inject(
      ItemSelectionService
    ) as jasmine.SpyObj<ItemSelectionService>;
    appInformationStatesService = TestBed.inject(
      AppInformationStatesService
    ) as jasmine.SpyObj<AppInformationStatesService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    filtersService = TestBed.inject(
      FiltersService
    ) as jasmine.SpyObj<FiltersService>;
    itemSelectionService.getUserTransactions.and.returnValue(
      Promise.resolve([])
    );
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize account transactions on ngOnInit', async () => {
    const mockAccount = of(new Account());
    const mockTransactions: Transaction[] = [];
    itemSelectionService.currentAccount = mockAccount;
    itemSelectionService.getUserTransactions.and.returnValue(
      Promise.resolve(mockTransactions)
    );
    convertService.getGroupedUserTransactions.and.returnValue([]);
    filtersService.sortByDate.and.stub();
    filtersService.setOriginalTransactionsArray.and.stub();
    appInformationStatesService.changeTransactionsArrayLength.and.stub();
    component.ngOnInit();
    expect(itemSelectionService.getUserTransactions).toHaveBeenCalledWith(
      'account'
    );
  });
  it('should calculate total incoming and outgoing balances', () => {
    const mockTransactions: Transaction[] = [
      {
        type: 'incoming',
        status: 'settled',
        amount: 100,
        currency: 'USD',
      } as Transaction,
      {
        type: 'outgoing',
        status: 'settled',
        amount: 50,
        currency: 'USD',
      } as Transaction,
    ];
    component.accountTransactions = mockTransactions;
    component.account.currency = 'USD';
    convertService.getConversionRate.and.returnValue(1);
    component.calculateBalances();
    expect(component.totalIncomingBalance).toBe(100);
    expect(component.totalOutgoingBalance).toBe(50);
  });
  it('should convert currency correctly', () => {
    convertService.getConversionRate.and.returnValue(1.2);
    const convertedAmount = component.convertCurrency(100, 'USD', 'EUR');
    expect(convertedAmount).toBe(120);
  });
});
