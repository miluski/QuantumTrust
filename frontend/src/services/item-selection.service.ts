import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Transaction } from '../types/transaction';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectionService {
  private selectedAccount: BehaviorSubject<Account>;
  private selectedCard: BehaviorSubject<Card>;
  currentAccount: Observable<Account>;
  currentCard: Observable<Card>;
  constructor(private userService: UserService) {
    this.selectedAccount = new BehaviorSubject(new Account());
    this.selectedCard = new BehaviorSubject(new Card());
    this.currentAccount = this.selectedAccount.asObservable();
    this.currentCard = this.selectedCard.asObservable();
  }
  setSelectedAccount(selectedAccount: Account): void {
    this.selectedAccount.next(selectedAccount);
  }
  setSelectedCard(selectedCard: Card): void {
    this.selectedCard.next(selectedCard);
  }
  public async getUserTransactions(
    itemType: 'account' | 'card'
  ): Promise<Transaction[]> {
    let userTransactions: Transaction[] =
      await this.userService.getUserTransactionsArray();
    userTransactions = userTransactions.filter(
      (transaction: Transaction) =>
        transaction.accountNumber ===
        (itemType === 'account'
          ? this.selectedAccount.getValue().id
          : this.selectedCard.getValue().id)
    );
    return userTransactions;
  }
}
