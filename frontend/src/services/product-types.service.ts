import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductTypesService {
  private accountType: BehaviorSubject<string> = new BehaviorSubject(
    'personal'
  );
  private depositType: BehaviorSubject<string> = new BehaviorSubject('timely');
  private cardType: BehaviorSubject<string> = new BehaviorSubject('standard');
  public currentAccountType = this.accountType.asObservable();
  public currentDepositType = this.depositType.asObservable();
  public currentCardType = this.cardType.asObservable();
  changeAccountType(accountType: string): void {
    this.accountType.next(accountType);
  }
  changeDepositType(depositType: string): void {
    this.depositType.next(depositType);
  }
  changeCardType(cardType: string): void {
    this.cardType.next(cardType);
  }
}
