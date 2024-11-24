import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { Deposit } from '../../types/deposit';
import { Transaction } from '../../types/transaction';
import { FinancesComponent } from './finances.component';

describe('FinancesComponent', () => {
  let component: FinancesComponent;
  let fixture: ComponentFixture<FinancesComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  let appInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let itemSelectionService: jasmine.SpyObj<ItemSelectionService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'userAccounts',
      'userDeposits',
      'userCards',
      'userTransactions',
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getGroupedUserTransactions',
    ]);
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName']
    );
    const itemSelectionServiceSpy = jasmine.createSpyObj(
      'ItemSelectionService',
      ['setSelectedAccount', 'setSelectedCard']
    );

    await TestBed.configureTestingModule({
      declarations: [FinancesComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ItemSelectionService, useValue: itemSelectionServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    appInformationStatesService = TestBed.inject(
      AppInformationStatesService
    ) as jasmine.SpyObj<AppInformationStatesService>;
    itemSelectionService = TestBed.inject(
      ItemSelectionService
    ) as jasmine.SpyObj<ItemSelectionService>;

    userService.userAccounts = of([]);
    userService.userDeposits = of([]);
    userService.userCards = of([]);
    userService.userTransactions = of([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data on init', () => {
    spyOn(component, 'initializeUserData');
    component.ngOnInit();
    expect(component.initializeUserData).toHaveBeenCalled();
  });

  it('should set user accounts', () => {
    const accounts: Account[] = [
      {
        id: '1',
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    userService.userAccounts = of(accounts);
    component.setUserAccounts();
    expect(component.userAccounts).toEqual(accounts);
  });

  it('should set user deposits', () => {
    const deposits: Deposit[] = [
      {
        id: '1',
        type: '',
        percent: 0,
        image: '',
        description: '',
        shortDescription: '',
      },
    ];
    userService.userDeposits = of(deposits);
    component.setUserDeposits();
    expect(component.userDeposits).toEqual(deposits);
  });

  it('should set user cards', () => {
    const cards: Card[] = [
      {
        id: 1,
        assignedAccountNumber: '1234 5678 9012 3456',
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        limits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
    ];
    userService.userCards = of(cards);
    component.setUserCards();
    expect(component.userCards).toEqual(cards);
  });

  it('should set user transactions', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        date: new Date().toString(),
        amount: 100,
        hour: '',
        title: '',
        assignedAccountNumber: '',
        type: 'incoming',
        category: '',
        currency: '',
        accountAmountAfter: 0,
        accountCurrency: '',
        status: 'blockade',
      },
    ];
    userService.userTransactions = of(transactions);
    component.setUserTransactions();
    expect(component.userTransactions).toEqual(transactions);
  });

  it('should filter transactions', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        date: new Date().toString(),
        amount: 100,
        hour: '',
        title: '',
        assignedAccountNumber: '',
        type: 'incoming',
        category: '',
        currency: '',
        accountAmountAfter: 0,
        accountCurrency: '',
        status: 'blockade',
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toString(),
        amount: 200,
        hour: '',
        title: '',
        assignedAccountNumber: '',
        type: 'incoming',
        category: '',
        currency: '',
        accountAmountAfter: 0,
        accountCurrency: '',
        status: 'blockade',
      },
      {
        id: 3,
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toString(),
        amount: 300,
        hour: '',
        title: '',
        assignedAccountNumber: '',
        type: 'incoming',
        category: '',
        currency: '',
        accountAmountAfter: 0,
        accountCurrency: '',
        status: 'blockade',
      },
    ];
    component.userTransactions = transactions;
    component.filterTransactions();
    expect(component.userTransactions.length).toBe(2);
  });

  it('should group user transactions', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        date: new Date().toString(),
        amount: 100,
        hour: '',
        title: '',
        assignedAccountNumber: '',
        type: 'incoming',
        category: '',
        currency: '',
        accountAmountAfter: 0,
        accountCurrency: '',
        status: 'blockade',
      },
    ];
    component.userTransactions = transactions;
    convertService.getGroupedUserTransactions.and.returnValue([
      [transactions[0]],
    ]);
    component.groupUserTransactions();
    expect(component.dailyTransactions.length).toBe(1);
  });

  it('should change tab name', () => {
    const tabName = 'New Tab';
    component.changeTabName(tabName);
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      tabName
    );
  });

  it('should get day and month from date', () => {
    const date = new Date().toString();
    const result = component.getDayAndMonthFromDate(date);
    expect(result).toContain('Dzisiaj, ');
  });

  it('should set selected account', () => {
    const account: Account = {
      id: '1',
      advertismentText: '',
      advertismentContent: '',
      image: '',
      type: '',
      benefits: [],
    };
    component.setSelectedAccount(account);
    expect(itemSelectionService.setSelectedAccount).toHaveBeenCalledWith(
      account
    );
  });

  it('should set selected card', () => {
    const card: Card = {
      id: 1,
      type: '',
      description: '',
      image: '',
      backImage: '',
      benefits: [],
      limits: [],
      fees: {
        release: 0,
        monthly: 0,
      },
    };
    component.setSelectedCard(card);
    expect(itemSelectionService.setSelectedCard).toHaveBeenCalledWith(card);
  });

  it('should get shortened account number', () => {
    const transaction: Transaction = {
      id: 1,
      date: new Date().toString(),
      amount: 100,
      assignedAccountNumber: '1234567890123456789012345678901234',
      hour: '',
      title: '',
      type: 'incoming',
      category: '',
      currency: '',
      accountAmountAfter: 0,
      accountCurrency: '',
      status: 'blockade',
    };
    const result = component.getShortenedAccountNumber(transaction);
    expect(result).toBe('234');
  });

  it('should handle width change', () => {
    spyOn(component.accountsPaginationService, 'handleWidthChange');
    spyOn(component.cardPaginationService, 'handleWidthChange');
    component.handleWidthChange();
    expect(
      component.accountsPaginationService.handleWidthChange
    ).toHaveBeenCalled();
    expect(
      component.cardPaginationService.handleWidthChange
    ).toHaveBeenCalled();
  });
});
