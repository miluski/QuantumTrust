import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Transaction } from '../types/transaction';
import { UserService } from './user.service';

/**
 * @fileoverview ItemSelectionService manages the selection of user accounts and cards.
 * It provides functionalities to set the selected account and card, and to retrieve user transactions based on the selected item.
 *
 * @service
 * @providedIn root
 *
 * @class ItemSelectionService
 * @property {Card[]} userCards - The array of user cards.
 * @property {BehaviorSubject<Account>} selectedAccount - The currently selected account.
 * @property {BehaviorSubject<Card>} selectedCard - The currently selected card.
 * @property {Observable<Account>} currentAccount - Observable for the currently selected account.
 * @property {Observable<Card>} currentCard - Observable for the currently selected card.
 *
 * @method setSelectedAccount - Sets the selected account.
 * @param {Account} selectedAccount - The account to select.
 * @method setSelectedCard - Sets the selected card.
 * @param {Card} selectedCard - The card to select.
 * @method getUserTransactions - Retrieves user transactions based on the selected item type.
 * @param {'account' | 'card'} itemType - The type of item to filter transactions by.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions.
 * @method setUserCardsArray - Sets the array of user cards.
 * @method isTransactionAccountIdEqualToItemId - Checks if the transaction account ID matches the selected item ID.
 * @param {'account' | 'card'} itemType - The type of item to check.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - True if the transaction account ID matches the selected item ID, false otherwise.
 * @method isAccountIdAssignedToCardEqualToItemId - Checks if the account ID assigned to a card matches the selected account ID.
 * @param {'account' | 'card'} itemType - The type of item to check.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - True if the account ID assigned to a card matches the selected account ID, false otherwise.
 *
 * @constructor
 * @param {UserService} userService - Service for managing user data.
 */
@Injectable({
  providedIn: 'root',
})
export class ItemSelectionService {
  private selectedAccount: BehaviorSubject<Account>;
  private selectedCard: BehaviorSubject<Card>;
  public userCards!: Card[];
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
    if (!this.userCards) {
      return false;
    }
    return itemType === 'account'
      ? this.userCards.some(
          (card: Card) =>
            transaction.accountNumber === card.id &&
            card.assignedAccountId === this.selectedAccount.getValue().id
        )
      : false;
  }
}
