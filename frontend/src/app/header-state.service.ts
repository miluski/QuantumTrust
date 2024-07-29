import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderStateService {
  private tabName: BehaviorSubject<string> = new BehaviorSubject('Konta');
  private isDrawerOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentTabName = this.tabName.asObservable();
  currentIsDrawerOpened = this.isDrawerOpened.asObservable();
  changeTabName(tabName: string): void {
    this.tabName.next(tabName);
  }
  changeIsDrawerOpened(isDrawerOpened: boolean): void {
    this.isDrawerOpened.next(isDrawerOpened);
  }
}
