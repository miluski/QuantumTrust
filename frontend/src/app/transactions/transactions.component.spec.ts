import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { UserService } from '../../services/user.service';
import { Card } from '../../types/card';
import { TableTransaction } from '../../types/table-transaction';
import { Transaction } from '../../types/transaction';
import { mockCards } from '../../utils/mock-cards';
import { mockTransactions } from '../../utils/mock-transactions';
import { TransactionsComponent } from './transactions.component';

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeSortedBy(key: string, options?: { descending?: boolean }): boolean;
    }
  }
}
function toBeSortedBy() {
  return {
    compare: (
      actual: any[],
      key: string,
      options?: { descending?: boolean }
    ) => {
      const isSorted = actual.every((item, index) => {
        if (index === 0) return true;
        const prevItem = actual[index - 1];
        if (options?.descending) {
          return item[key] <= prevItem[key];
        } else {
          return item[key] >= prevItem[key];
        }
      });
      return {
        pass: isSorted,
        message: `Expected array to be sorted by ${key} in ${
          options?.descending ? 'descending' : 'ascending'
        } order`,
      };
    },
  };
}

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let globalTransactionsFiltersService: jasmine.SpyObj<GlobalTransactionsFiltersService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  beforeEach(async () => {
    jasmine.addMatchers({
      toBeSortedBy,
    });
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserTransactionsArray',
      'getUserCardsArray',
    ]);
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName']
    );
    const globalTransactionsFiltersServiceSpy = jasmine.createSpyObj(
      'GlobalTransactionsFiltersService',
      ['setOriginalTableTransactionsArray', 'setAppliedFilter'],
      {
        tableDataSource: new MatTableDataSource<TableTransaction>([]),
      }
    );
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getNumberWithSpacesBetweenThousands',
      'getShortenedAccountId'
    ]);
    await TestBed.configureTestingModule({
      imports: [
        TransactionsComponent,
        MatPaginatorModule,
        MatTableModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
      providers: [
        DatePipe,
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        {
          provide: GlobalTransactionsFiltersService,
          useValue: globalTransactionsFiltersServiceSpy,
        },
        { provide: ConvertService, useValue: convertServiceSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appInformationStatesService = TestBed.inject(
      AppInformationStatesService
    ) as jasmine.SpyObj<AppInformationStatesService>;
    globalTransactionsFiltersService = TestBed.inject(
      GlobalTransactionsFiltersService
    ) as jasmine.SpyObj<GlobalTransactionsFiltersService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should change tab name', () => {
    const tabName = 'New Tab';
    component.changeTabName(tabName);
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      tabName
    );
  });
  it('should fetch and set user transactions and cards', async () => {
    const transactions: Transaction[] = mockTransactions;
    const cards: Card[] = mockCards;
    userService.getUserTransactionsArray.and.returnValue(
      Promise.resolve(transactions)
    );
    userService.getUserCardsArray.and.returnValue(Promise.resolve(cards));
    await component.setUserTransactions();
    expect(component.userTransactions).toEqual(transactions);
    expect(component.userCards).toEqual(cards);
  });
  it('should map user transactions into table transactions', () => {
    component.userTransactions = mockTransactions;
    component.userCards = mockCards;
    component.mapUserTransactionsIntoTableTransactions();
    fixture.detectChanges();
    expect(
      globalTransactionsFiltersService.tableDataSource.data.length
    ).toBeGreaterThan(0);
  });
  it('should set paginator', () => {
    component.setPaginator();
    expect(globalTransactionsFiltersService.tableDataSource.paginator).toBe(
      component.paginator
    );
  });
  it('should set table transaction fields', () => {
    const transaction: Transaction = mockTransactions[0];
    const tableTransaction: TableTransaction = new TableTransaction();
    component.setTableTransactionFields(transaction, tableTransaction);
    expect(tableTransaction.accountNumber).toBeDefined();
    expect(tableTransaction.amountWithCurrency).toBeDefined();
    expect(tableTransaction.dateAndHour).toBeDefined();
    expect(tableTransaction.status).toBe(transaction.status);
    expect(tableTransaction.title).toBe(transaction.title);
    expect(tableTransaction.type).toBe(transaction.type);
    expect(globalTransactionsFiltersService.tableDataSource.data).toBeSortedBy(
      'dateAndHour.date',
      { descending: false }
    );
    component.setAccountNumber(transaction, tableTransaction);
    expect(tableTransaction.accountNumber).toBeDefined();
  });
  it('should set amount with currency', () => {
    const transaction: Transaction = mockTransactions[0];
    const tableTransaction: TableTransaction = new TableTransaction();
    component.setAmountWithCurrency(transaction, tableTransaction);
    expect(tableTransaction.amountWithCurrency).toBeDefined();
  });
  it('should set date and hour', () => {
    const transaction: Transaction = mockTransactions[0];
    const tableTransaction: TableTransaction = new TableTransaction();
    component.setDateAndHour(transaction, tableTransaction);
    expect(tableTransaction.dateAndHour).toBeDefined();
  });
  it('should sort table transactions array', () => {
    component.sortTableTransactionsArray();
    fixture.detectChanges();
    expect(globalTransactionsFiltersService.tableDataSource.data).toBeSortedBy(
      'dateAndHour.date',
      { descending: false }
    );
  });
  it('should change date format', () => {
    component.changeDateFormat();
    fixture.detectChanges();
    const dateFormatRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    globalTransactionsFiltersService.tableDataSource.data.forEach(
      (transaction: TableTransaction) => {
        expect(dateFormatRegex.test(transaction.dateAndHour.date)).toBeTrue();
      }
    );
  });
  it('should get account ID assigned to card', () => {
    component.userCards = mockCards;
    const accountId = component.getAccountIdAssignedToCard(1234567890123456);
    expect(accountId).toBe('PL 49 1020 2892 2276 3005 0000 0001');
  });
});
