import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderStateService {
  drawer?: MatDrawer;
  private tabName: BehaviorSubject<string>;
  currentTabName: Observable<string>;
  private isDrawerOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentIsDrawerOpened: Observable<boolean> =
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

  toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  isDrawerOpen(): boolean {
    return this.drawer ? this.drawer.opened : false;
  }
}
