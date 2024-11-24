import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../types/transaction';

/**
 * @class FiltersService
 * @description This service is responsible for managing filters for transactions, including search phrases, selected filters, and mobile filters state.
 *
 * @providedIn 'root'
 *
 * @property {BehaviorSubject<string>} searchPhrase - The search phrase for filtering transactions.
 * @property {BehaviorSubject<string[]>} selectedFilters - The selected filters for sorting and filtering transactions.
 * @property {BehaviorSubject<boolean>} isMobileFiltersOpened - The state of the mobile filters (opened or closed).
 * @property {BehaviorSubject<boolean[]>} expansionFlagsArray - The expansion flags array for managing the state of filter menus.
 * @property {Observable<string>} currentSearchPhrase - Observable for the current search phrase.
 * @property {Transaction[][]} originalTransactionsArray - The original array of transactions.
 * @property {Observable<string[]>} currentSelectedFilters - Observable for the current selected filters.
 * @property {Observable<boolean>} currentIsMobileFiltersOpened - Observable for the current state of mobile filters.
 * @property {Observable<boolean[]>} currentExpansionFlagsArray - Observable for the current expansion flags array.
 *
 * @constructor
 *
 * @method resetSelectedFilters - Resets the selected filters and search phrase.
 * @method applyFilters - Applies the selected filters to the transactions array.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {Transaction[][]} transactionsArray - The array of transactions to be filtered.
 * @method setIsMobileFiltersOpened - Sets the state of the mobile filters.
 * @param {boolean} isMobileFiltersOpened - The new state of the mobile filters.
 * @method setOriginalTransactionsArray - Sets the original array of transactions.
 * @param {Transaction[][]} transactionsArray - The array of transactions to be set as the original array.
 * @method setSelectedFilters - Sets the selected filters.
 * @param {string[]} selectedFilters - The new selected filters.
 * @method setSearchPhrase - Sets the search phrase.
 * @param {string} searchPhrase - The new search phrase.
 * @method changeMenuState - Changes the state of the filter menu.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {number} menuNumber - The number of the menu to be changed.
 * @method sortByDate - Sorts the transactions array by date.
 * @param {Transaction[][]} transactionArray - The array of transactions to be sorted.
 * @param {'asc' | 'desc'} sortType - The type of sorting (ascending or descending).
 * @method actualSelectedFilters - Getter method to get the current selected filters.
 * @returns {string[]} - Returns the current selected filters.
 * @method filterBySearchPhrase - Filters the transactions array by the search phrase.
 * @param {Transaction[][]} transactionArray - The array of transactions to be filtered.
 * @method applySortFilter - Applies the sort filter to the transactions array.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {Transaction[][]} transactionsArray - The array of transactions to be sorted.
 * @method applyDurationFilter - Applies the duration filter to the transactions array.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {Transaction[][]} transactionsArray - The array of transactions to be filtered by duration.
 * @method applyStatusFilter - Applies the status filter to the transactions array.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {Transaction[][]} transactionsArray - The array of transactions to be filtered by status.
 * @method sortByTransactionAmount - Sorts the transactions array by transaction amount.
 * @param {Transaction[][]} transactionArray - The array of transactions to be sorted.
 * @param {'asc' | 'desc'} sortType - The type of sorting (ascending or descending).
 * @method filterByStatus - Filters the transactions array by status.
 * @param {Transaction[][]} transactionArray - The array of transactions to be filtered.
 * @param {'blockade' | 'settled'} status - The status to filter by.
 * @method filterByDate - Filters the transactions array by date.
 * @param {Transaction[][]} transactionArray - The array of transactions to be filtered.
 * @param {'day' | 'week' | 'month' | 'half-year' | 'year'} dateDuration - The duration to filter by.
 * @method replaceArray - Replaces the transactions array with another array.
 * @param {Transaction[][]} transactionArray - The array of transactions to be replaced.
 * @param {Transaction[][]} replacingTransactionArray - The array of transactions to replace with.
 * @method getDuration - Gets the duration date based on the date duration.
 * @param {'day' | 'week' | 'month' | 'half-year' | 'year'} dateDuration - The duration to get the date for.
 * @returns {Date} - Returns the duration date.
 * @method handleMenuExpansion - Handles the expansion of the filter menu.
 * @param {boolean} isExpanded - Flag indicating if the filter menu is expanded.
 * @param {number} menuNumber - The number of the menu to be expanded.
 * @method expandMenu - Expands the filter menu.
 * @param {number} menuNumber - The number of the menu to be expanded.
 * @method closeMenu - Closes the filter menu.
 * @param {number} menuNumber - The number of the menu to be closed.
 */
@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private searchPhrase: BehaviorSubject<string>;
  private selectedFilters: BehaviorSubject<string[]>;
  private isMobileFiltersOpened: BehaviorSubject<boolean>;
  private expansionFlagsArray: BehaviorSubject<boolean[]>;

  public currentSearchPhrase: Observable<string>;
  public originalTransactionsArray!: Transaction[][];
  public currentSelectedFilters: Observable<string[]>;
  public currentIsMobileFiltersOpened: Observable<boolean>;
  public currentExpansionFlagsArray: Observable<boolean[]>;

  constructor() {
    this.searchPhrase = new BehaviorSubject('');
    this.selectedFilters = new BehaviorSubject([
      'Domyślnie',
      'Domyślnie',
      'Domyślnie',
    ]);
    this.isMobileFiltersOpened = new BehaviorSubject(false);
    this.expansionFlagsArray = new BehaviorSubject<boolean[]>([
      false,
      false,
      false,
    ]);
    this.currentSearchPhrase = this.searchPhrase.asObservable();
    this.currentSelectedFilters = this.selectedFilters.asObservable();
    this.currentExpansionFlagsArray = this.expansionFlagsArray.asObservable();
    this.currentIsMobileFiltersOpened =
      this.isMobileFiltersOpened.asObservable();
  }

  public resetSelectedFilters(): void {
    this.setSelectedFilters(['Domyślnie', 'Domyślnie', 'Domyślnie']);
    this.setSearchPhrase('');
  }

  public applyFilters(
    isExpanded: boolean,
    transactionsArray: Transaction[][]
  ): void {
    this.replaceArray(transactionsArray, this.originalTransactionsArray);
    this.filterBySearchPhrase(transactionsArray);
    this.selectedFilters.getValue()[0] !== 'Domyślnie' &&
      this.applySortFilter(isExpanded, transactionsArray);
    this.selectedFilters.getValue()[1] !== 'Domyślnie' &&
      this.applyDurationFilter(isExpanded, transactionsArray);
    this.selectedFilters.getValue()[2] !== 'Domyślnie' &&
      this.applyStatusFilter(isExpanded, transactionsArray);
    this.selectedFilters.getValue()[0] === 'Domyślnie' &&
      this.handleMenuExpansion(isExpanded, 0);
    this.selectedFilters.getValue()[1] === 'Domyślnie' &&
      this.handleMenuExpansion(isExpanded, 1);
    this.selectedFilters.getValue()[2] === 'Domyślnie' &&
      this.handleMenuExpansion(isExpanded, 2);
  }

  public setIsMobileFiltersOpened(isMobileFiltersOpened: boolean): void {
    this.isMobileFiltersOpened.next(isMobileFiltersOpened);
  }

  public setOriginalTransactionsArray(
    transactionsArray: Transaction[][]
  ): void {
    this.originalTransactionsArray = JSON.parse(
      JSON.stringify(transactionsArray)
    );
  }

  public setSelectedFilters(selectedFilters: string[]): void {
    this.selectedFilters.next(selectedFilters);
  }

  public setSearchPhrase(searchPhrase: string): void {
    this.searchPhrase.next(searchPhrase);
  }

  public changeMenuState(isExpanded: boolean, menuNumber: number): void {
    isExpanded ? this.closeMenu(menuNumber) : this.expandMenu(menuNumber);
  }

  public sortByDate(
    transactionArray: Transaction[][],
    sortType: 'asc' | 'desc'
  ): void {
    transactionArray.sort(
      (firstArray: Transaction[], secondArray: Transaction[]) => {
        if (firstArray.length === 0 || secondArray.length === 0) {
          return 0;
        }
        const firstDate: number = new Date(firstArray[0].date).getTime();
        const secondDate: number = new Date(secondArray[0].date).getTime();
        if (isNaN(firstDate) || isNaN(secondDate)) {
          return 0;
        }
        const sortResult: number =
          sortType === 'asc' ? firstDate - secondDate : secondDate - firstDate;
        return sortResult;
      }
    );
  }

  public get actualSelectedFilters(): string[] {
    return this.selectedFilters.getValue();
  }

  private filterBySearchPhrase(transactionArray: Transaction[][]): void {
    if (this.searchPhrase.getValue() !== '') {
      const lowerCaseSearchPhrase = this.searchPhrase.getValue().toLowerCase();
      const filteredTransactionArray: Transaction[][] = transactionArray.map(
        (dailyTransactionsArray: Transaction[]) =>
          dailyTransactionsArray.filter((transaction: Transaction) =>
            transaction.title.toLowerCase().includes(lowerCaseSearchPhrase)
          )
      );
      this.replaceArray(transactionArray, filteredTransactionArray);
    }
  }

  private applySortFilter(
    isExpanded: boolean,
    transactionsArray: Transaction[][]
  ): void {
    switch (this.actualSelectedFilters[0]) {
      case 'Po dacie rosnąco':
        this.sortByDate(transactionsArray, 'asc');
        break;
      case 'Po dacie malejąco':
        this.sortByDate(transactionsArray, 'desc');
        break;
      case 'Po kwocie transakcji rosnąco (dla dnia)':
        this.sortByTransactionAmount(transactionsArray, 'asc');
        break;
      case 'Po kwocie transakcji malejąco (dla dnia)':
        this.sortByTransactionAmount(transactionsArray, 'desc');
        break;
      default:
        this.replaceArray(transactionsArray, this.originalTransactionsArray);
        break;
    }
    this.changeMenuState(isExpanded, 0);
    this.setIsMobileFiltersOpened(false);
  }

  private applyDurationFilter(
    isExpanded: boolean,
    transactionsArray: Transaction[][]
  ): void {
    switch (this.actualSelectedFilters[1]) {
      case 'Ostatni dzień':
        this.filterByDate(transactionsArray, 'day');
        break;
      case 'Ostatni tydzień':
        this.filterByDate(transactionsArray, 'week');
        break;
      case 'Ostatni miesiąc':
        this.filterByDate(transactionsArray, 'month');
        break;
      case 'Ostatnie pół roku':
        this.filterByDate(transactionsArray, 'half-year');
        break;
      case 'Ostatni rok':
        this.filterByDate(transactionsArray, 'year');
        break;
      default:
        this.replaceArray(transactionsArray, this.originalTransactionsArray);
        break;
    }
    this.changeMenuState(isExpanded, 1);
    this.setIsMobileFiltersOpened(false);
  }

  private applyStatusFilter(
    isExpanded: boolean,
    transactionsArray: Transaction[][]
  ): void {
    switch (this.actualSelectedFilters[2]) {
      case 'Blokada':
        this.filterByStatus(transactionsArray, 'blockade');
        break;
      case 'Rozliczona':
        this.filterByStatus(transactionsArray, 'settled');
        break;
      default:
        this.replaceArray(transactionsArray, this.originalTransactionsArray);
        break;
    }
    this.changeMenuState(isExpanded, 2);
    this.setIsMobileFiltersOpened(false);
  }

  private sortByTransactionAmount(
    transactionArray: Transaction[][],
    sortType: 'asc' | 'desc'
  ): void {
    transactionArray.forEach((transactionsArray: Transaction[]) => {
      transactionsArray.sort(
        (firstTransaction: Transaction, secondTransaction: Transaction) =>
          sortType === 'asc'
            ? firstTransaction.amount - secondTransaction.amount
            : secondTransaction.amount - firstTransaction.amount
      );
    });
  }

  private filterByStatus(
    transactionArray: Transaction[][],
    status: 'blockade' | 'settled'
  ): void {
    const filteredTransactionArray: Transaction[][] = transactionArray.map(
      (dailyTransactionArray: Transaction[]) =>
        dailyTransactionArray.filter(
          (transaction: Transaction) => transaction.status === status
        )
    );
    this.replaceArray(transactionArray, filteredTransactionArray);
  }

  private filterByDate(
    transactionArray: Transaction[][],
    dateDuration: 'day' | 'week' | 'month' | 'half-year' | 'year'
  ): void {
    const duration: Date = this.getDuration(dateDuration);
    const filteredTransactionArray: Transaction[][] = transactionArray.map(
      (dailyTransactionsArray: Transaction[]) =>
        dailyTransactionsArray.filter((transaction: Transaction) =>
          dateDuration !== 'day'
            ? new Date(transaction.date).getTime() >= duration.getTime()
            : new Date(transaction.date).getTime() === duration.getTime()
        )
    );
    this.replaceArray(transactionArray, filteredTransactionArray);
  }

  private replaceArray(
    transactionArray: Transaction[][],
    replacingTransactionArray: Transaction[][]
  ): void {
    if (!Array.isArray(replacingTransactionArray)) {
      throw new TypeError('replacingTransactionArray is not iterable');
    }
    transactionArray.splice(
      0,
      transactionArray.length,
      ...replacingTransactionArray
    );
  }

  private getDuration(
    dateDuration: 'day' | 'week' | 'month' | 'half-year' | 'year'
  ): Date {
    const today: Date = new Date();
    const lastDay: Date = new Date(today);
    const lastWeek: Date = new Date(today);
    const lastMonth: Date = new Date(today);
    const lastHalfYear: Date = new Date(today);
    const lastYear: Date = new Date(today);
    lastDay.setDate(today.getDate() - 1);
    lastWeek.setDate(today.getDate() - 7);
    lastMonth.setMonth(today.getMonth() - 1);
    lastHalfYear.setMonth(today.getMonth() - 6);
    lastYear.setFullYear(today.getFullYear() - 1);
    switch (dateDuration) {
      case 'day':
        return lastDay;
      case 'week':
        return lastWeek;
      case 'month':
        return lastMonth;
      case 'half-year':
        return lastHalfYear;
      default:
        return lastYear;
    }
  }

  private handleMenuExpansion(isExpanded: boolean, menuNumber: number): void {
    this.changeMenuState(isExpanded, menuNumber);
    this.setIsMobileFiltersOpened(false);
  }

  private expandMenu(menuNumber: number): void {
    switch (menuNumber) {
      case 0:
        this.expansionFlagsArray.next([true, false, false]);
        break;
      case 1:
        this.expansionFlagsArray.next([false, true, false]);
        break;
      default:
        this.expansionFlagsArray.next([false, false, true]);
        break;
    }
  }

  private closeMenu(menuNumber: number): void {
    const currentFlagsArray: boolean[] = this.expansionFlagsArray.getValue();
    currentFlagsArray[menuNumber] = false;
    this.expansionFlagsArray.next(currentFlagsArray);
  }
}
