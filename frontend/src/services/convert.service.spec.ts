import { TestBed } from '@angular/core/testing';
import { Account } from '../types/account';
import { CardSettings } from '../types/card-settings';
import { Transaction } from '../types/transaction';
import {
  BOTTOM_INFORMATION,
  ONE_MONTH,
  SIX_MONTHS,
  THREE_MONTHS,
  TWELVE_MONTHS,
} from '../utils/enums';
import { ConvertService } from './convert.service';

describe('ConvertService', () => {
  let service: ConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert account type to Polish', () => {
    expect(service.getPolishAccountType('multiCurrency')).toBe('wielowalutowe');
    expect(service.getPolishAccountType('young')).toBe('dla młodych');
    expect(service.getPolishAccountType('family')).toBe('rodzinne');
    expect(service.getPolishAccountType('oldPeople')).toBe('senior');
    expect(service.getPolishAccountType('unknown')).toBe('osobiste');
  });

  it('should convert deposit type to Polish', () => {
    expect(service.getPolishDepositType('timely')).toBe('terminowa');
    expect(service.getPolishDepositType('mobile')).toBe('mobilna');
    expect(service.getPolishDepositType('family')).toBe('rodzinna');
    expect(service.getPolishDepositType('progressive')).toBe('progresywna');
    expect(service.getPolishDepositType('timely', BOTTOM_INFORMATION)).toBe(
      'terminową'
    );
  });

  it('should return deposit icon', () => {
    expect(service.getDepositIcon('timely')).toBe('calendar_month');
    expect(service.getDepositIcon('mobile')).toBe('phone_iphone');
    expect(service.getDepositIcon('family')).toBe('savings');
    expect(service.getDepositIcon('progressive')).toBe('bar_chart');
  });

  it('should return icon class from transaction category', () => {
    expect(
      service.getIconClassFromTransactionCategory('Artykuły spożywcze')
    ).toBe('fa-cart-shopping');
    expect(service.getIconClassFromTransactionCategory('Rachunki')).toBe(
      'fa-money-bill'
    );
    expect(service.getIconClassFromTransactionCategory('Rozrywka')).toBe(
      'fa-film'
    );
    expect(service.getIconClassFromTransactionCategory('unknown')).toBe(
      'fa-question'
    );
  });

  it('should format number with spaces between thousands', () => {
    expect(service.getNumberWithSpacesBetweenThousands(1234567.89)).toBe(
      '1 234 567,89'
    );
    expect(service.getNumberWithSpacesBetweenThousands(1234567)).toBe(
      '1 234 567'
    );
    expect(service.getNumberWithSpacesBetweenThousands()).toBe('');
  });

  it('should group user transactions by date', () => {
    const transactions: Transaction[] = [
      {
        date: '2023-01-01',
        amount: 100,
        id: 0,
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
        date: '2023-01-01',
        amount: 200,
        id: 0,
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
        date: '2023-01-02',
        amount: 300,
        id: 0,
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
    const groupedTransactions =
      service.getGroupedUserTransactions(transactions);
    expect(groupedTransactions.length).toBe(2);
    expect(groupedTransactions[0].length).toBe(2);
    expect(groupedTransactions[1].length).toBe(1);
  });

  it('should return day of the week from date', () => {
    expect(service.getDayFromDate('2023-01-01')).toBe('Niedziela');
    expect(service.getDayFromDate('2023-01-02')).toBe('Poniedziałek');
  });

  it('should return day of the week from number', () => {
    expect(service.getWeekDayFromNumber(0)).toBe('Niedziela');
    expect(service.getWeekDayFromNumber(1)).toBe('Poniedziałek');
    expect(service.getWeekDayFromNumber(2)).toBe('Wtorek');
    expect(service.getWeekDayFromNumber(3)).toBe('Środa');
    expect(service.getWeekDayFromNumber(4)).toBe('Czwartek');
    expect(service.getWeekDayFromNumber(5)).toBe('Piątek');
    expect(service.getWeekDayFromNumber(6)).toBe('Sobota');
  });

  it('should return number of months for interval', () => {
    expect(service.getMonths(ONE_MONTH)).toBe(1);
    expect(service.getMonths(THREE_MONTHS)).toBe(3);
    expect(service.getMonths(SIX_MONTHS)).toBe(6);
    expect(service.getMonths(TWELVE_MONTHS)).toBe(12);
  });

  it('should return month form for interval', () => {
    expect(service.getMonthForm(ONE_MONTH)).toBe('miesiąc');
    expect(service.getMonthForm(THREE_MONTHS)).toBe('miesiące');
    expect(service.getMonthForm(SIX_MONTHS)).toBe('miesięcy');
    expect(service.getMonthForm(TWELVE_MONTHS)).toBe('miesięcy');
  });

  it('should return formatted account option string', () => {
    const account: Account = {
      id: '1234567890',
      type: 'multiCurrency',
      balance: 1000,
      currency: 'PLN',
      advertismentText: '',
      advertismentContent: '',
      image: '',
      benefits: [],
    };
    expect(service.getAccountOptionString(account)).toBe(
      'Konto wielowalutowe, 12345 **** 7890, 1 000 PLN'
    );
  });

  it('should return shortened account ID', () => {
    expect(service.getShortenedAccountId('1234567890')).toBe('12345 **** 7890');
  });

  it('should calculate amount based on currency conversion', () => {
    spyOn(service, 'getConversionRate').and.returnValue(4);
    expect(service.getCalculatedAmount('USD', 100)).toBe(400);
  });

  it('should return conversion rate between two currencies', () => {
    spyOn(service, 'getConversionRate').and.callThrough();
    expect(service.getConversionRate('PLN', 'USD')).toBeDefined();
  });

  it('should return step value for card settings', () => {
    const cardSettings: CardSettings = {
      currency: 'PLN',
      card: {
        limits: [{ cashTransactions: [1000], internetTransactions: [2000] }],
        id: 0,
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
      limitType: 'min',
      limits: {
        internetTransactionsLimit: 0,
        cashTransactionsLimit: 0,
      },
      transactionType: 'cash',
      assignedAccountNumber: '',
    };
    expect(service.getStep(cardSettings)).toBeDefined();
  });

  it('should return formatted transactions limit', () => {
    const cardSettings: CardSettings = {
      currency: 'PLN',
      card: {
        limits: [{ cashTransactions: [1000], internetTransactions: [2000] }],
        id: 0,
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
      limitType: 'min',
      limits: {
        internetTransactionsLimit: 0,
        cashTransactionsLimit: 0,
      },
      transactionType: 'cash',
      assignedAccountNumber: '',
    };
    expect(service.getFormattedTransactionsLimit(cardSettings)).toBeDefined();
  });

  it('should return transactions limit for card settings', () => {
    const cardSettings: CardSettings = {
      currency: 'PLN',
      card: {
        limits: [{ cashTransactions: [1000], internetTransactions: [2000] }],
        id: 0,
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
      limitType: 'min',
      limits: {
        internetTransactionsLimit: 0,
        cashTransactionsLimit: 0,
      },
      transactionType: 'cash',
      assignedAccountNumber: '',
    };
    expect(service.getTransactionsLimit(cardSettings)).toBeDefined();
  });

  it('should return current transaction limit for card settings', () => {
    const cardSettings: CardSettings = {
      currency: 'PLN',
      card: {
        limits: [{ cashTransactions: [1000], internetTransactions: [2000] }],
        id: 0,
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
      limitType: 'min',
      limits: {
        internetTransactionsLimit: 0,
        cashTransactionsLimit: 0,
      },
      transactionType: 'cash',
      assignedAccountNumber: '',
    };
    expect(service.getCurrentTransactionLimit(cardSettings)).toBeDefined();
  });

  it('should return max limit for card settings', () => {
    const cardSettings: CardSettings = {
      currency: 'PLN',
      card: {
        limits: [{ cashTransactions: [1000], internetTransactions: [2000] }],
        id: 0,
        type: '',
        description: '',
        image: '',
        backImage: '',
        benefits: [],
        fees: {
          release: 0,
          monthly: 0,
        },
      },
      limitType: 'min',
      limits: {
        internetTransactionsLimit: 0,
        cashTransactionsLimit: 0,
      },
      transactionType: 'cash',
      assignedAccountNumber: '',
    };
    expect(service.getMaxLimit(cardSettings)).toBeDefined();
  });

  it('should return min limit for a given currency', () => {
    expect(service.getMinLimit('PLN')).toBeDefined();
  });
});
