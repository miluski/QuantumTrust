import { TestBed } from '@angular/core/testing';
import { Transaction } from '../types/transaction';
import { FiltersService } from './filters.service';

describe('FiltersService', () => {
  let service: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset selected filters and search phrase', () => {
    service.setSelectedFilters(['Test', 'Test', 'Test']);
    service.setSearchPhrase('Test');
    service.resetSelectedFilters();
    expect(service.actualSelectedFilters).toEqual([
      'Domyślnie',
      'Domyślnie',
      'Domyślnie',
    ]);
    expect(service.currentSearchPhrase).toBeTruthy();
  });

  it('should set mobile filters state', () => {
    service.setIsMobileFiltersOpened(true);
    service.currentIsMobileFiltersOpened.subscribe((state) => {
      expect(state).toBeTrue();
    });
  });

  it('should set original transactions array', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-01',
          title: 'Test',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.setOriginalTransactionsArray(transactions);
    expect(service.originalTransactionsArray).toEqual(transactions);
  });

  it('should set selected filters', () => {
    const filters = ['Filter1', 'Filter2', 'Filter3'];
    service.setSelectedFilters(filters);
    expect(service.actualSelectedFilters).toEqual(filters);
  });

  it('should set search phrase', () => {
    const phrase = 'Test';
    service.setSearchPhrase(phrase);
    service.currentSearchPhrase.subscribe((searchPhrase) => {
      expect(searchPhrase).toBe(phrase);
    });
  });

  it('should change menu state', () => {
    service.changeMenuState(true, 0);
    service.currentExpansionFlagsArray.subscribe((flags) => {
      expect(flags).toEqual([false, false, false]);
    });
  });

  it('should sort transactions by date', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-02',
          title: 'Test2',
          amount: 200,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
      [
        {
          date: '2023-01-01',
          title: 'Test1',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.sortByDate(transactions, 'asc');
    expect(transactions[0][0].date).toBe('2023-01-01');
  });

  it('should filter transactions by search phrase', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-01',
          title: 'Test1',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
      [
        {
          date: '2023-01-02',
          title: 'Test2',
          amount: 200,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.setSearchPhrase('Test1');
    service['filterBySearchPhrase'](transactions);
    expect(transactions[0].length).toBe(1);
    expect(transactions[1].length).toBe(0);
  });

  it('should apply sort filter', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-02',
          title: 'Test2',
          amount: 200,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
      [
        {
          date: '2023-01-01',
          title: 'Test1',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.setOriginalTransactionsArray(transactions);
    service.setSelectedFilters(['Domyślnie', 'Domyślnie', 'settled']);
    service.applyFilters(true, transactions);
    expect(transactions[0][0].date).toBe('2023-01-02');
  });

  it('should apply duration filter', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-01',
          title: 'Test1',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
      [
        {
          date: '2023-01-02',
          title: 'Test2',
          amount: 200,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.setOriginalTransactionsArray(transactions);
    service.setSelectedFilters(['Domyślnie', 'Ostatni dzień', 'Domyślnie']);
    service.applyFilters(false, transactions);
    expect(transactions[0].length).toBe(0);
  });

  it('should apply status filter', () => {
    const transactions: Transaction[][] = [
      [
        {
          date: '2023-01-01',
          title: 'Test1',
          amount: 100,
          status: 'settled',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
      [
        {
          date: '2023-01-02',
          title: 'Test2',
          amount: 200,
          status: 'blockade',
          id: 0,
          hour: '',
          assignedAccountNumber: '',
          type: 'incoming',
          category: '',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
        },
      ],
    ];
    service.setOriginalTransactionsArray(transactions);
    service.setSelectedFilters(['Domyślnie', 'Domyślnie', 'Blokada']);
    service.applyFilters(false, transactions);
    expect(transactions[0].length).toBe(0);
    expect(transactions[1].length).toBe(1);
  });
});
