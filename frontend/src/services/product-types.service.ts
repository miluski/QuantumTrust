import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @class ProductTypesService
 * @description This service is responsible for managing the types of products such as cards, deposits, and accounts.
 *
 * @providedIn 'root'
 *
 * @property {BehaviorSubject<string>} cardType - The current card type.
 * @property {BehaviorSubject<string>} depositType - The current deposit type.
 * @property {BehaviorSubject<string>} accountType - The current account type.
 * @property {Observable<string>} currentCardType - Observable for the current card type.
 * @property {Observable<string>} currentDepositType - Observable for the current deposit type.
 * @property {Observable<string>} currentAccountType - Observable for the current account type.
 *
 * @constructor
 *
 * @method changeAccountType - Changes the current account type.
 * @param {string} accountType - The new account type to be set.
 * @method changeDepositType - Changes the current deposit type.
 * @param {string} depositType - The new deposit type to be set.
 * @method changeCardType - Changes the current card type.
 * @param {string} cardType - The new card type to be set.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductTypesService {
  private cardType: BehaviorSubject<string>;
  private depositType: BehaviorSubject<string>;
  private accountType: BehaviorSubject<string>;

  public currentCardType;
  public currentDepositType;
  public currentAccountType;

  constructor() {
    this.cardType = new BehaviorSubject('standard');
    this.depositType = new BehaviorSubject('timely');
    this.accountType = new BehaviorSubject('personal');
    this.currentCardType = this.cardType.asObservable();
    this.currentDepositType = this.depositType.asObservable();
    this.currentAccountType = this.accountType.asObservable();
  }

  public changeAccountType(accountType: string): void {
    this.accountType.next(accountType);
  }

  public changeDepositType(depositType: string): void {
    this.depositType.next(depositType);
  }

  public changeCardType(cardType: string): void {
    this.cardType.next(cardType);
  }
}
