import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { Transaction } from '../../types/transaction';
import { FinancesComponent } from './finances.component';

describe('FinancesComponent', () => {
  let component: FinancesComponent;
  let fixture: ComponentFixture<FinancesComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let itemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserAccountsArray',
      'getUserDepositsArray',
      'getUserTransactionsArray',
      'getUserCardsArray',
    ]);
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName']
    );
    const itemSelectionServiceSpy = jasmine.createSpyObj(
      'ItemSelectionService',
      ['setSelectedAccount', 'setSelectedCard']
    );
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getGroupedUserTransactions',
    ]);
    await TestBed.configureTestingModule({
      imports: [FinancesComponent, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ItemSelectionService, useValue: itemSelectionServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        PaginationService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FinancesComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appInformationStatesService = TestBed.inject(
      AppInformationStatesService
    ) as jasmine.SpyObj<AppInformationStatesService>;
    itemSelectionService = TestBed.inject(
      ItemSelectionService
    ) as jasmine.SpyObj<ItemSelectionService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    userService.getUserAccountsArray.and.returnValue(Promise.resolve([]));
    userService.getUserDepositsArray.and.returnValue(Promise.resolve([]));
    userService.getUserTransactionsArray.and.returnValue(Promise.resolve([]));
    userService.getUserCardsArray.and.returnValue(Promise.resolve([]));
    convertService.getGroupedUserTransactions.and.returnValue([[]]);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set paginated arrays', () => {
    component.userAccounts = [
      { id: 1, name: 'Account 1' } as unknown as Account,
    ];
    component.userCards = [{ id: 1, name: 'Card 1' } as unknown as Card];
    component.setPaginatedArrays();
    expect(component.accountsPaginationService.paginatedArray).toEqual(
      component.userAccounts
    );
    expect(component.cardPaginationService.paginatedArray).toEqual(
      component.userCards
    );
  });
  it('should handle width change', () => {
    spyOn(component.accountsPaginationService, 'handleWidthChange');
    spyOn(component.cardPaginationService, 'handleWidthChange');
    component.handleWidthChange();
    expect(
      component.accountsPaginationService.handleWidthChange
    ).toHaveBeenCalledWith(window.innerWidth);
    expect(
      component.cardPaginationService.handleWidthChange
    ).toHaveBeenCalledWith(window.innerWidth);
  });
  it('should group user transactions', () => {
    component.userTransactions = [{ id: 1, date: '2023-10-10' } as Transaction];
    component.groupUserTransactions();
    expect(convertService.getGroupedUserTransactions).toHaveBeenCalledWith(
      component.userTransactions
    );
  });
  it('should change tab name', () => {
    const tabName = 'New Tab';
    component.changeTabName(tabName);
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      tabName
    );
  });
  it('should get day and month from date', () => {
    const date = '2023-10-10';
    const result = component.getDayAndMonthFromDate(date);
    expect(result).toContain('10.10');
  });
  it('should set selected account', () => {
    const account = { id: 1, name: 'Account 1' } as unknown as Account;
    component.setSelectedAccount(account);
    expect(itemSelectionService.setSelectedAccount).toHaveBeenCalledWith(
      account
    );
  });
  it('should set selected card', () => {
    const card = { id: 1, name: 'Card 1' } as unknown as Card;
    component.setSelectedCard(card);
    expect(itemSelectionService.setSelectedCard).toHaveBeenCalledWith(card);
  });
  it('should get shortened account number', () => {
    const transaction = {
      accountNumber: '123456789012345678901234567890123',
    } as Transaction;
    const result = component.getShortenedAccountNumber(transaction);
    expect(result).toBe('23');
  });
  it('should filter transactions', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];
    component.userTransactions = [
      { date: today } as Transaction,
      { date: yesterday } as Transaction,
      { date: '2023-01-01' } as Transaction,
    ];
    component.filterTransactions();
    expect(component.userTransactions.length).toBe(1);
  });
});
