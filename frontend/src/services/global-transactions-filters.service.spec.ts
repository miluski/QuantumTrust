import { TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { TableTransaction } from '../types/table-transaction';
import { GlobalTransactionsFiltersService } from './global-transactions-filters.service';

describe('GlobalTransactionsFiltersService', () => {
  let service: GlobalTransactionsFiltersService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTransactionsFiltersService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set the original table transactions array', () => {
    const transactions: TableTransaction[] = [
      {
        title: '',
        dateAndHour: {
          date: '',
          hour: '',
        },
        accountNumber: '',
        amountWithCurrency: '',
        type: 'incoming',
        status: 'blockade',
      },
    ];
    service.setOriginalTableTransactionsArray(transactions);
    expect(service['originalTableTransactionsArray']).toEqual(transactions);
  });
  it('should set the applied filter and search phrase', () => {
    const transactions: TableTransaction[] = [
      {
        title: '',
        dateAndHour: {
          date: '',
          hour: '',
        },
        accountNumber: '',
        amountWithCurrency: '',
        type: 'incoming',
        status: 'blockade',
      },
    ];
    service.setOriginalTableTransactionsArray(transactions);
    service.tableDataSource = new MatTableDataSource<TableTransaction>(
      transactions
    );
    service.setAppliedFilter('Wpływy', 'Transaction 1');
    expect(service['appliedFilter']).toBe('Wpływy');
    expect(service['searchedPhrase']).toBe('transaction 1');
  });
  it('should set the search phrase and filter transactions', () => {
    const transactions: TableTransaction[] = [
      {
        title: '',
        dateAndHour: {
          date: '',
          hour: '',
        },
        accountNumber: '',
        amountWithCurrency: '',
        type: 'incoming',
        status: 'blockade',
      },
    ];
    service.setOriginalTableTransactionsArray(transactions);
    service.tableDataSource = new MatTableDataSource<TableTransaction>(
      transactions
    );
    service.setSearchPhrase('Transaction 1');
    expect(service['searchedPhrase']).toBe('transaction 1');
  });
  it('should reset the table transactions array', () => {
    const transactions: TableTransaction[] = [
      {
        title: '',
        dateAndHour: {
          date: '',
          hour: '',
        },
        accountNumber: '',
        amountWithCurrency: '',
        type: 'incoming',
        status: 'blockade',
      },
    ];
    service.setOriginalTableTransactionsArray(transactions);
    service.tableDataSource = new MatTableDataSource<TableTransaction>([]);
    service.resetArray();
    expect(service.tableDataSource.data).toEqual(transactions);
  });
  it('should return the accepted filters array', () => {
    expect(service.acceptedFiltersArray).toEqual([
      'Wszystkie',
      'Wpływy',
      'Wydatki',
    ]);
  });
  it('should return the actual applied filter', () => {
    service['appliedFilter'] = 'Wpływy';
    expect(service.actualAppliedFilter).toBe('Wpływy');
  });
  it('should return the actual searched phrase', () => {
    service['searchedPhrase'] = 'test';
    expect(service.actualSearchedPhrase).toBe('test');
  });
  it('should return the English equivalent of the applied filter', () => {
    service['appliedFilter'] = 'Wpływy';
    expect(service['englishFilterType']).toBe('incoming');
    service['appliedFilter'] = 'Wydatki';
    expect(service['englishFilterType']).toBe('outgoing');
    service['appliedFilter'] = 'Wszystkie';
    expect(service['englishFilterType']).toBe('all');
  });
});
