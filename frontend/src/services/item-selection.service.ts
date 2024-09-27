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
  private userCards!: Card[];
  private selectedAccount: BehaviorSubject<Account>;
  private selectedCard: BehaviorSubject<Card>;
  public currentAccount: Observable<Account>;
  public currentCard: Observable<Card>;
  constructor(private userService: UserService) {
    this.selectedAccount = new BehaviorSubject(new Account());
    this.selectedCard = new BehaviorSubject(new Card());
    this.currentAccount = this.selectedAccount.asObservable();
    this.currentCard = this.selectedCard.asObservable();
    this.setUserCardsArray();
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
        this.isTransactionAccountIdEqualToItemId(itemType, transaction) ||
        this.isAccountIdAssignedToCardEqualToItemId(itemType, transaction)
    );
    return userTransactions;
  }
  private async setUserCardsArray(): Promise<void> {
    this.userCards = await this.userService.getUserCardsArray();
  }
  private isTransactionAccountIdEqualToItemId(
    itemType: 'account' | 'card',
    transaction: Transaction
  ): boolean {
    return (
      transaction.accountNumber ===
      (itemType === 'account'
        ? this.selectedAccount.getValue().id
        : this.selectedCard.getValue().id)
    );
  }
  private isAccountIdAssignedToCardEqualToItemId(
    itemType: 'account' | 'card',
    transaction: Transaction
  ): boolean {
    return itemType === 'account'
      ? this.userCards.some(
          (card: Card) =>
            transaction.accountNumber === card.id &&
            card.assignedAccountId === this.selectedAccount.getValue().id
        )
      : false;
  }
}
