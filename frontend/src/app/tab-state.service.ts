import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabStateService {
  private tabName = new BehaviorSubject('Konta');
  currentTabName = this.tabName.asObservable();
  changeTabName(tabName: string) {
    this.tabName.next(tabName);
  }
}
