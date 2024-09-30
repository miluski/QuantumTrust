import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableTransaction } from '../types/table-transaction';

/**
 * @fileoverview GlobalTransactionsFiltersService manages the filtering and searching of table transactions.
 * It provides functionalities to set and reset filters, search phrases, and manage the state of mobile filters.
 *
 * @service
 * @providedIn root
 *
 * @class GlobalTransactionsFiltersService
 * @property {TableTransaction[]} originalTableTransactionsArray - The original array of table transactions.
 * @property {string[]} acceptedFilters - The list of accepted filters.
 * @property {string} appliedFilter - The currently applied filter.
 * @property {string} searchedPhrase - The current search phrase.
 * @property {boolean} isMobileFiltersOpened - The state of mobile filters (opened or closed).
 * @property {MatTableDataSource<TableTransaction>} tableDataSource - The data source for the table transactions.
 *
 * @method setOriginalTableTransactionsArray - Sets the original array of table transactions.
 * @param {TableTransaction[]} tableTransactionArray - The original array of table transactions.
 * @method setAppliedFilter - Sets the applied filter and search phrase, and filters the transactions accordingly.
 * @param {string} appliedFilter - The filter to apply.
 * @param {string} searchedPhrase - The search phrase to apply.
 * @method setSearchPhrase - Sets the search phrase and filters the transactions accordingly.
 * @param {string} searchedPhrase - The search phrase to apply.
 * @method resetArray - Resets the table transactions array to the original array.
 * @method replaceArray - Replaces the current table transactions array with a new array.
 * @param {TableTransaction[]} newArray - The new array of table transactions.
 * @method get acceptedFiltersArray - Returns the list of accepted filters.
 * @returns {string[]} - The list of accepted filters.
 * @method get actualAppliedFilter - Returns the currently applied filter.
 * @returns {string} - The currently applied filter.
 * @method get actualSearchedPhrase - Returns the current search phrase.
 * @returns {string} - The current search phrase.
 * @method get englishFilterType - Returns the English equivalent of the applied filter.
 * @returns {string} - The English equivalent of the applied filter.
 */
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
