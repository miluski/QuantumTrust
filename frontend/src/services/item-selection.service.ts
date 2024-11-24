import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Transaction } from '../types/transaction';
import { UserService } from './user.service';

/**
 * @class ItemSelectionService
 * @description This service is responsible for managing the selection of items such as accounts and cards.
 *
 * @providedIn 'root'
 *
 * @property {BehaviorSubject<Card>} selectedCard - The currently selected card.
 * @property {BehaviorSubject<Account>} selectedAccount - The currently selected account.
 * @property {Card[]} userCards - Array of user cards.
 * @property {Observable<Card>} currentCard - Observable for the currently selected card.
 * @property {Observable<Account>} currentAccount - Observable for the currently selected account.
 *
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 *
 * @method setSelectedAccount - Sets the currently selected account.
 * @param {Account} selectedAccount - The account to be selected.
 * @method setSelectedCard - Sets the currently selected card.
 * @param {Card} selectedCard - The card to be selected.
 * @method isTransactionAccountIdEqualToItemId - Checks if the transaction's account ID is equal to the selected item's ID.
 * @param {'account' | 'card'} itemType - The type of item to check.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - Returns true if the transaction's account ID is equal to the selected item's ID, otherwise false.
 * @method isAccountIdAssignedToCardEqualToItemId - Checks if the account ID assigned to the card is equal to the selected item's ID.
 * @param {'account' | 'card'} itemType - The type of item to check.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - Returns true if the account ID assigned to the card is equal to the selected item's ID, otherwise false.
 * @method setUserCardsArray - Sets the array of user cards by subscribing to the userCards observable.
 */
@Injectable({
  providedIn: 'root',
})
export class ItemSelectionService {
  private selectedCard: BehaviorSubject<Card>;
  private selectedAccount: BehaviorSubject<Account>;

  public userCards!: Card[];
  public currentCard: Observable<Card>;
  public currentAccount: Observable<Account>;

  constructor(private userService: UserService) {
    this.selectedCard = new BehaviorSubject(new Card());
    this.selectedAccount = new BehaviorSubject(new Account());
    this.currentCard = this.selectedCard.asObservable();
    this.currentAccount = this.selectedAccount.asObservable();
    this.setUserCardsArray();
  }

  public setSelectedAccount(selectedAccount: Account): void {
    this.selectedAccount.next(selectedAccount);
  }

  public setSelectedCard(selectedCard: Card): void {
    this.selectedCard.next(selectedCard);
  }

  public isTransactionAccountIdEqualToItemId(
    itemType: 'account' | 'card',
    transaction: Transaction
  ): boolean {
    return (
      String(transaction.assignedAccountNumber) ===
      (itemType === 'account'
        ? String(this.selectedAccount.getValue().id)
        : String(this.selectedCard.getValue().id))
    );
  }

  public isAccountIdAssignedToCardEqualToItemId(
    itemType: 'account' | 'card',
    transaction: Transaction
  ): boolean {
    if (!this.userCards) {
      return false;
    }
    return itemType === 'account'
      ? this.userCards.some((card: Card) => {
          return (
            String(transaction.assignedAccountNumber) === String(card.id) &&
            String(card.assignedAccountNumber) ===
              String(this.selectedAccount.getValue().id)
          );
        })
      : false;
  }

  public setUserCardsArray(): void {
    this.userService.userCards.subscribe((newUserCards: Card[]) => {
      if (newUserCards.length >= 1) {
        this.userCards = newUserCards;
      }
    });
  }
}
