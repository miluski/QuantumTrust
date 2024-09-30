import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @fileoverview ProductTypesService manages the types of products such as accounts, deposits, and cards.
 * It provides functionalities to change and observe the current types of these products.
 *
 * @service
 * @providedIn root
 *
 * @class ProductTypesService
 * @property {BehaviorSubject<string>} accountType - The current account type.
 * @property {BehaviorSubject<string>} depositType - The current deposit type.
 * @property {BehaviorSubject<string>} cardType - The current card type.
 * @property {Observable<string>} currentAccountType - Observable for the current account type.
 * @property {Observable<string>} currentDepositType - Observable for the current deposit type.
 * @property {Observable<string>} currentCardType - Observable for the current card type.
 *
 * @method changeAccountType - Changes the current account type.
 * @param {string} accountType - The new account type.
 * @method changeDepositType - Changes the current deposit type.
 * @param {string} depositType - The new deposit type.
 * @method changeCardType - Changes the current card type.
 * @param {string} cardType - The new card type.
 */
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
