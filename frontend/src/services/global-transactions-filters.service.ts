import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableTransaction } from '../types/table-transaction';

/**
 * @class GlobalTransactionsFiltersService
 * @description This service is responsible for managing global filters for transactions, including applied filters, search phrases, and mobile filters state.
 *
 * @providedIn 'root'
 *
 * @property {string} appliedFilter - The currently applied filter.
 * @property {string} searchedPhrase - The current search phrase.
 * @property {string[]} acceptedFilters - The array of accepted filters.
 * @property {TableTransaction[]} originalTableTransactionsArray - The original array of table transactions.
 * @property {boolean} isMobileFiltersOpened - The state of the mobile filters (opened or closed).
 * @property {MatTableDataSource<TableTransaction>} tableDataSource - The data source for the table transactions.
 *
 * @constructor
 *
 * @method setOriginalTableTransactionsArray - Sets the original array of table transactions.
 * @param {TableTransaction[]} tableTransactionArray - The array of table transactions to be set as the original array.
 * @method setAppliedFilter - Sets the applied filter and search phrase.
 * @param {string} appliedFilter - The new applied filter.
 * @param {string} searchedPhrase - The new search phrase.
 * @method setSearchPhrase - Sets the search phrase and filters the transactions based on the search phrase.
 * @param {string} searchedPhrase - The new search phrase.
 * @method resetArray - Resets the table transactions array to the original array.
 * @method acceptedFiltersArray - Getter method to get the array of accepted filters.
 * @returns {string[]} - Returns the array of accepted filters.
 * @method actualAppliedFilter - Getter method to get the currently applied filter.
 * @returns {string} - Returns the currently applied filter.
 * @method actualSearchedPhrase - Getter method to get the current search phrase.
 * @returns {string} - Returns the current search phrase.
 * @method replaceArray - Replaces the table transactions array with another array.
 * @param {TableTransaction[]} newArray - The array of table transactions to replace with.
 * @method englishFilterType - Getter method to get the English equivalent of the applied filter.
 * @returns {string} - Returns the English equivalent of the applied filter.
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalTransactionsFiltersService {
  private appliedFilter: string;
  private searchedPhrase: string;
  private acceptedFilters: string[];
  private originalTableTransactionsArray!: TableTransaction[];

  public isMobileFiltersOpened: boolean;
  public tableDataSource: MatTableDataSource<TableTransaction>;

  constructor() {
    this.searchedPhrase = '';
    this.appliedFilter = 'Wszystkie';
    this.isMobileFiltersOpened = false;
    this.acceptedFilters = ['Wszystkie', 'Wpływy', 'Wydatki'];
    this.tableDataSource = new MatTableDataSource<TableTransaction>([]);
  }

  public setOriginalTableTransactionsArray(
    tableTransactionArray: TableTransaction[]
  ): void {
    this.originalTableTransactionsArray = JSON.parse(
      JSON.stringify(tableTransactionArray)
    );
  }

  public setAppliedFilter(appliedFilter: string, searchedPhrase: string): void {
    this.resetArray();
    this.appliedFilter = appliedFilter;
    const filteredArray: TableTransaction[] = this.tableDataSource.data.filter(
      (transaction: TableTransaction) =>
        transaction.type === this.englishFilterType
    );
    appliedFilter !== 'Wszystkie' ? this.replaceArray(filteredArray) : null;
    this.setSearchPhrase(searchedPhrase);
  }

  public setSearchPhrase(searchedPhrase: string): void {
    this.searchedPhrase = searchedPhrase.toLowerCase();
    if (searchedPhrase !== '') {
      const filteredArray: TableTransaction[] =
        this.tableDataSource.data.filter((transaction: TableTransaction) =>
          transaction.title.toLowerCase().includes(this.searchedPhrase)
        );
      this.replaceArray(filteredArray);
    }
  }

  public resetArray(): void {
    this.tableDataSource.data = this.originalTableTransactionsArray
      ? JSON.parse(JSON.stringify(this.originalTableTransactionsArray))
      : this.tableDataSource.data;
  }

  public get acceptedFiltersArray(): string[] {
    return this.acceptedFilters;
  }

  public get actualAppliedFilter(): string {
    return this.appliedFilter;
  }

  public get actualSearchedPhrase(): string {
    return this.searchedPhrase;
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
