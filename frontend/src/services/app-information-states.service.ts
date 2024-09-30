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
 * @fileoverview AppInformationStatesService manages the state information of the application.
 * It handles the current tab name, drawer state, and transactions array length.
 * It also observes breakpoints to manage the drawer state based on screen size.
 *
 * @service
 * @providedIn root
 *
 * @class AppInformationStatesService
 * @property {BehaviorSubject<string>} tabName - The current tab name.
 * @property {BehaviorSubject<boolean>} isDrawerOpened - The state of the drawer (opened or closed).
 * @property {BehaviorSubject<number>} transactionsArrayLength - The length of the transactions array.
 * @property {MatDrawer} drawer - The drawer component.
 * @property {Observable<string>} currentTabName - Observable for the current tab name.
 * @property {Observable<number>} currentTransactionsArrayLength - Observable for the transactions array length.
 * @property {Observable<boolean>} currentIsDrawerOpened - Observable for the drawer state.
 *
 * @method observeBreakpoints - Observes screen size breakpoints and closes the drawer if necessary.
 * @method changeDrawer - Changes the drawer component.
 * @method changeTabName - Changes the current tab name.
 * @method changeIsDrawerOpened - Changes the state of the drawer (opened or closed).
 * @method changeTransactionsArrayLength - Changes the length of the transactions array.
 * @method toggleDrawer - Toggles the state of the drawer (opened or closed).
 * @method isDrawerOpen - Returns whether the drawer is open.
 * @method canSetAbsoluteStyle - Determines if absolute style can be set based on the transactions array.
 *
 * @constructor
 * @param {Router} router - Angular Router service for navigation.
 * @param {BreakpointObserver} breakpointObserver - Service to observe screen size breakpoints.
 */
@Injectable({
  providedIn: 'root',
})
export class AppInformationStatesService {
  private tabName: BehaviorSubject<string>;
  private isDrawerOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private transactionsArrayLength: BehaviorSubject<number> =
    new BehaviorSubject(0);
  protected drawer?: MatDrawer;
  public currentTabName: Observable<string>;
  public currentTransactionsArrayLength: Observable<number> =
    this.transactionsArrayLength.asObservable();
  public currentIsDrawerOpened: Observable<boolean> =
    this.isDrawerOpened.asObservable();
  constructor(router: Router, private breakpointObserver: BreakpointObserver) {
    this.tabName =
      router.url === '/main-page'
        ? new BehaviorSubject('Finanse')
        : new BehaviorSubject('Konta');
    this.currentTabName = this.tabName.asObservable();
  }
  observeBreakpoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result: BreakpointState) => {
        if (result.matches && this.drawer) {
          this.drawer.close();
        }
      });
  }
  changeDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }
  changeTabName(tabName: string): void {
    this.tabName.next(tabName);
  }
  changeIsDrawerOpened(isDrawerOpened: boolean): void {
    this.isDrawerOpened.next(isDrawerOpened);
  }
  changeTransactionsArrayLength(transactionsArrayLength: number): void {
    this.transactionsArrayLength.next(transactionsArrayLength);
  }
  toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
  isDrawerOpen(): boolean {
    return this.drawer ? this.drawer.opened : false;
  }
  canSetAbsoluteStyle(transactionsArray: Transaction[][]): boolean {
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
