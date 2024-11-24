import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../types/transaction';

/**
 * @class AppInformationStatesService
 * @description This service is responsible for managing application state information, such as the current tab name, drawer state, and transactions array length.
 *
 * @providedIn 'root'
 *
 * @property {BehaviorSubject<string>} tabName - The current tab name.
 * @property {BehaviorSubject<boolean>} isDrawerOpened - The state of the drawer (opened or closed).
 * @property {BehaviorSubject<number>} transactionsArrayLength - The length of the transactions array.
 * @property {MatDrawer | undefined} drawer - The drawer component.
 * @property {Observable<string>} currentTabName - Observable for the current tab name.
 * @property {Observable<boolean>} currentIsDrawerOpened - Observable for the drawer state.
 * @property {Observable<number>} currentTransactionsArrayLength - Observable for the transactions array length.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {BreakpointObserver} breakpointObserver - Service to observe breakpoints.
 *
 * @method observeBreakpoints - Observes breakpoints to manage the state of the drawer.
 * @method changeDrawer - Changes the drawer component.
 * @param {MatDrawer} drawer - The drawer component.
 * @method changeTabName - Changes the current tab name.
 * @param {string} tabName - The new tab name to be set.
 * @method changeIsDrawerOpened - Changes the state of the drawer.
 * @param {boolean} isDrawerOpened - The new state of the drawer.
 * @method changeTransactionsArrayLength - Changes the length of the transactions array.
 * @param {number} transactionsArrayLength - The new length of the transactions array.
 * @method toggleDrawer - Toggles the state of the drawer.
 * @method isDrawerOpen - Checks if the drawer is open.
 * @returns {boolean} - Returns true if the drawer is open, otherwise false.
 * @method canSetAbsoluteStyle - Determines if the absolute style can be set based on the transactions array.
 * @param {Transaction[][]} transactionsArray - An array of arrays of transactions.
 * @returns {boolean} - Returns true if the absolute style can be set, otherwise false.
 */
@Injectable({
  providedIn: 'root',
})
export class AppInformationStatesService {
  private tabName: BehaviorSubject<string>;
  private isDrawerOpened: BehaviorSubject<boolean>;
  private transactionsArrayLength: BehaviorSubject<number>;

  protected drawer?: MatDrawer;

  public currentTabName: Observable<string>;
  public currentIsDrawerOpened: Observable<boolean>;
  public currentTransactionsArrayLength: Observable<number>;

  constructor(router: Router, private breakpointObserver: BreakpointObserver) {
    this.isDrawerOpened = new BehaviorSubject(false);
    this.transactionsArrayLength = new BehaviorSubject(0);
    this.currentIsDrawerOpened = this.isDrawerOpened.asObservable();
    this.currentTransactionsArrayLength =
      this.transactionsArrayLength.asObservable();
    this.tabName =
      router.url === '/main-page'
        ? new BehaviorSubject('Finanse')
        : new BehaviorSubject('Konta');
    this.currentTabName = this.tabName.asObservable();
  }

  public observeBreakpoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result: BreakpointState) => {
        if (result.matches && this.drawer) {
          this.drawer.close();
        }
      });
  }

  public changeDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }

  public changeTabName(tabName: string): void {
    this.tabName.next(tabName);
  }

  public changeIsDrawerOpened(isDrawerOpened: boolean): void {
    this.isDrawerOpened.next(isDrawerOpened);
  }

  public changeTransactionsArrayLength(transactionsArrayLength: number): void {
    this.transactionsArrayLength.next(transactionsArrayLength);
  }

  public toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  public isDrawerOpen(): boolean {
    return this.drawer ? this.drawer.opened : false;
  }

  public canSetAbsoluteStyle(transactionsArray: Transaction[][]): boolean {
    let emptyArraysCount: number = 0;
    let oneElementArraysCount: number = 0;
    transactionsArray.forEach((transactionArray: Transaction[]) => {
      emptyArraysCount += transactionArray.length === 0 ? 1 : 0;
      oneElementArraysCount += transactionArray.length === 1 ? 1 : 0;
    });
    return (
      emptyArraysCount !== transactionsArray.length - 1 &&
      oneElementArraysCount > 1
    );
  }
}
