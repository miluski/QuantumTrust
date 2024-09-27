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
