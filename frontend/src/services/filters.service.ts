import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../types/transaction';

/**
 * @fileoverview FiltersService manages the state and application of filters for transactions.
 * It provides functionalities to open/close mobile filters, set and reset selected filters, and apply various filters to transactions.
 *
 * @service
 * @providedIn root
 *
 * @class FiltersService
 * @property {BehaviorSubject<boolean>} isMobileFiltersOpened - The state of mobile filters (opened or closed).
 * @property {BehaviorSubject<boolean[]>} expansionFlagsArray - The expansion state of filter menus.
 * @property {BehaviorSubject<string[]>} selectedFilters - The currently selected filters.
 * @property {BehaviorSubject<string>} searchPhrase - The current search phrase.
 * @property {Transaction[][]} originalTransactionsArray - The original array of transactions.
 * @property {Observable<boolean>} currentIsMobileFiltersOpened - Observable for the state of mobile filters.
 * @property {Observable<boolean[]>} currentExpansionFlagsArray - Observable for the expansion state of filter menus.
 * @property {Observable<string[]>} currentSelectedFilters - Observable for the currently selected filters.
 * @property {Observable<string>} currentSearchPhrase - Observable for the current search phrase.
 *
 * @method resetSelectedFilters - Resets the selected filters to default values.
 * @method applyFilters - Applies the selected filters to the transactions array.
 * @param {boolean} isExpanded - Indicates whether the filter menu is expanded.
 * @param {Transaction[][]} transactionsArray - The array of transactions to filter.
 * @method setIsMobileFiltersOpened - Sets the state of mobile filters (opened or closed).
 * @param {boolean} isMobileFiltersOpened - The new state of mobile filters.
 * @method setOriginalTransactionsArray - Sets the original array of transactions.
 * @param {Transaction[][]} transactionsArray - The original array of transactions.
 * @method setSelectedFilters - Sets the selected filters.
 * @param {string[]} selectedFilters - The new selected filters.
 * @method setSearchPhrase - Sets the search phrase.
 * @param {string} searchPhrase - The new search phrase.
 * @method changeMenuState - Changes the state of a filter menu (expanded or collapsed).
 * @param {boolean} isExpanded - Indicates whether the menu is expanded.
 * @param {number} menuNumber - The number of the menu to change.
 * @method sortByDate - Sorts the transactions array by date.
 * @param {Transaction[][]} transactionArray - The array of transactions to sort.
 * @param {'asc' | 'desc'} sortType - The type of sorting (ascending or descending).
 * @method sortByTransactionAmount - Sorts the transactions array by transaction amount.
 * @param {Transaction[][]} transactionArray - The array of transactions to sort.
 * @param {'asc' | 'desc'} sortType - The type of sorting (ascending or descending).
 * @method filterByStatus - Filters the transactions array by status.
 * @param {Transaction[][]} transactionArray - The array of transactions to filter.
 * @param {'blockade' | 'settled'} status - The status to filter by.
 * @method filterByDate - Filters the transactions array by date duration.
 * @param {Transaction[][]} transactionArray - The array of transactions to filter.
 * @param {'day' | 'week' | 'month' | 'half-year' | 'year'} dateDuration - The date duration to filter by.
 * @method replaceArray - Replaces the contents of the target transaction array with the contents of the replacing transaction array.
 * @param {Transaction[][]} transactionArray - The target transaction array to be replaced.
 * @param {Transaction[][]} replacingTransactionArray - The replacing transaction array.
 * @throws {TypeError} - If the replacing transaction array is not iterable.
 * @method getDuration - Returns the date object for the given date duration.
 * @param {'day' | 'week' | 'month' | 'half-year' | 'year'} dateDuration - The date duration.
 * @returns {Date} - The date object for the given date duration.
 * @method handleMenuExpansion - Handles the expansion state of a filter menu.
 * @param {boolean} isExpanded - Indicates whether the menu is expanded.
 * @param {number} menuNumber - The number of the menu to change.
 * @method expandMenu - Expands the specified filter menu.
 * @param {number} menuNumber - The number of the menu to expand.
 * @method closeMenu - Closes the specified filter menu.
 * @param {number} menuNumber - The number of the menu to close.
 *
 * @constructor
 * @param {Router} router - Angular Router service for navigation.
 * @param {BreakpointObserver} breakpointObserver - Service to observe screen size breakpoints.
 */
@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private isMobileFiltersOpened: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private expansionFlagsArray: BehaviorSubject<boolean[]> = new BehaviorSubject<
    boolean[]
  >([false, false, false]);
  private selectedFilters: BehaviorSubject<string[]> = new BehaviorSubject([
    'Domyślnie',
    'Domyślnie',
    'Domyślnie',
  ]);
  private searchPhrase: BehaviorSubject<string> = new BehaviorSubject('');
  public originalTransactionsArray!: Transaction[][];
  public currentIsMobileFiltersOpened: Observable<boolean> =
    this.isMobileFiltersOpened.asObservable();
  public currentExpansionFlagsArray: Observable<boolean[]> =
    this.expansionFlagsArray.asObservable();
  public currentSelectedFilters: Observable<string[]> =
    this.selectedFilters.asObservable();
  public currentSearchPhrase: Observable<string> =
    this.searchPhrase.asObservable();
  resetSelectedFilters(): void {
    this.setSelectedFilters(['Domyślnie', 'Domyślnie', 'Domyślnie']);
    this.setSearchPhrase('');
  }
  applyFilters(isExpanded: boolean, transactionsArray: Transaction[][]): void {
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
  setIsMobileFiltersOpened(isMobileFiltersOpened: boolean): void {
    this.isMobileFiltersOpened.next(isMobileFiltersOpened);
  }
  setOriginalTransactionsArray(transactionsArray: Transaction[][]): void {
    this.originalTransactionsArray = JSON.parse(
      JSON.stringify(transactionsArray)
    );
  }
  setSelectedFilters(selectedFilters: string[]): void {
    this.selectedFilters.next(selectedFilters);
  }
  setSearchPhrase(searchPhrase: string): void {
    this.searchPhrase.next(searchPhrase);
  }
  get actualSelectedFilters(): string[] {
    return this.selectedFilters.getValue();
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
