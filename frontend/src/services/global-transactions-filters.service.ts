import { Injectable, Input, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableTransaction } from '../types/table-transaction';

@Injectable({
  providedIn: 'root',
})
export class GlobalTransactionsFiltersService {
  private originalTableTransactionsArray!: TableTransaction[];
  private acceptedFilters: string[] = ['Wszystkie', 'Wpływy', 'Wydatki'];
  private appliedFilter: string = 'Wszystkie';
  private searchedPhrase: string = '';
  public isMobileFiltersOpened: boolean = false;
  public tableDataSource: MatTableDataSource<TableTransaction> =
    new MatTableDataSource<TableTransaction>([]);
  setOriginalTableTransactionsArray(
    tableTransactionArray: TableTransaction[]
  ): void {
    this.originalTableTransactionsArray = JSON.parse(
      JSON.stringify(tableTransactionArray)
    );
  }
  setAppliedFilter(appliedFilter: string, searchedPhrase: string): void {
    this.resetArray();
    this.appliedFilter = appliedFilter;
    const filteredArray: TableTransaction[] = this.tableDataSource.data.filter(
      (transaction: TableTransaction) =>
        transaction.type === this.englishFilterType
    );
    appliedFilter !== 'Wszystkie' ? this.replaceArray(filteredArray) : null;
    this.setSearchPhrase(searchedPhrase);
  }
  setSearchPhrase(searchedPhrase: string): void {
    this.searchedPhrase = searchedPhrase.toLowerCase();
    if (searchedPhrase !== '') {
      const filteredArray: TableTransaction[] =
        this.tableDataSource.data.filter((transaction: TableTransaction) =>
          transaction.title.toLowerCase().includes(this.searchedPhrase)
        );
      this.replaceArray(filteredArray);
    }
  }
  get acceptedFiltersArray(): string[] {
    return this.acceptedFilters;
  }
  get actualAppliedFilter(): string {
    return this.appliedFilter;
  }
  get actualSearchedPhrase(): string {
    return this.searchedPhrase;
  }
  public resetArray(): void {
    this.tableDataSource.data = this.originalTableTransactionsArray
      ? JSON.parse(JSON.stringify(this.originalTableTransactionsArray))
      : this.tableDataSource.data;
  }
  private replaceArray(newArray: TableTransaction[]): void {
    this.tableDataSource.data = newArray
      ? JSON.parse(JSON.stringify(newArray))
      : this.tableDataSource.data;
  }
  private get englishFilterType(): string {
    switch (this.appliedFilter) {
      case 'Wpływy':
        return 'incoming';
      case 'Wydatki':
        return 'outgoing';
      case 'Wszystkie':
      default:
        return 'all';
    }
  }
}
