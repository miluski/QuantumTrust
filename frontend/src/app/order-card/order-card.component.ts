import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  imports: [MatIconModule, CommonModule, FormsModule],
  animations: [
    trigger('rotateCard', [
      state('default', style({ transform: 'rotateY(0)' })),
      state('rotate', style({ transform: 'rotateY(180deg)' })),
      transition('default <=> rotate', [animate('0.6s ease-in-out')]),
    ]),
    trigger('fadeInCenter', [
      state('center', style({ opacity: 1 })),
      state('default', style({ opacity: 0.3 })),
      transition('default => center', [
        style({ opacity: 0 }),
        animate('1.5s ease-out'),
      ]),
    ]),
  ],
  standalone: true,
})
export class OrderCardComponent implements OnInit {
  protected userAccounts!: Account[];
  protected currentSelectedAccountId!: string;
  protected internetTransactionLimit: number = 500;
  protected cashTransactionLimit: number = 500;
  protected pinCode: number = 1111;
  constructor(
    protected userService: UserService,
    protected paginationService: PaginationService,
    protected convertService: ConvertService
  ) {
    this.paginationService.paginationMethod = 'movableItems';
  }
  ngOnInit(): void {
    const cardsArray: Card[] = this.cardsObjectsArray;
    this.paginationService.setPaginatedArray(cardsArray);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
    this.setUserAccounts();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }
  async setUserAccounts(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.currentSelectedAccountId = this.userAccounts[0].id;
    this.setMinTransactionsLimit();
  }
  rotateCard(card: Card): void {
    card.showingCardSite =
      card.showingCardSite === 'front' &&
      card.id === this.currentSelectedCard.id
        ? 'back'
        : 'front';
  }
  getRotateState(card: Card): string {
    const isCardIdSelected: boolean = card.id === this.currentSelectedCard.id;
    const isCardSiteFront: boolean = card.showingCardSite === 'front';
    !isCardIdSelected ? this.rotateCard(card) : null;
    return !isCardIdSelected || isCardSiteFront ? 'default' : 'rotate';
  }
  getCardState(index: number): string {
    return this.isCardIndexAtCenter(index) ? 'center' : 'default';
  }
  isCardIndexAtCenter(index: number): boolean {
    return this.currentSelectedCard.id === index;
  }
  getFormattedTransactionsLimit(
    type: 'min' | 'max',
    limitType: 'cash' | 'internet'
  ): string {
    const limit = this.getTransactionsLimit(type, limitType);
    return limit.toLocaleString('pl-PL');
  }
  getTransactionsLimit(
    type: 'min' | 'max',
    limitType: 'cash' | 'internet'
  ): number {
    const currentLimit: number =
      type === 'max'
        ? limitType === 'internet'
          ? this.currentSelectedCard.limits[0].internetTransactions[0]
          : this.currentSelectedCard.limits[0].cashTransactions[0]
        : 500;
    const convertedLimit: number = this.convertService.getCalculatedAmount(
      this.currentSelectedAccount.currency ?? 'PLN',
      currentLimit
    );
    return convertedLimit;
  }
  getCurrentTransactionLimit(limitType: 'cash' | 'internet'): number {
    const upLimit: number = this.getMaxLimit(
      this.currentSelectedAccount.currency ?? 'PLN',
      limitType
    );
    const downLimit: number = this.getMinLimit(
      this.currentSelectedAccount.currency ?? 'PLN'
    );
    limitType === 'cash'
      ? this.setCashTransactionLimit(upLimit, downLimit)
      : this.setInternetTransactionLimit(upLimit, downLimit);
    return limitType === 'cash'
      ? this.cashTransactionLimit
      : this.internetTransactionLimit;
  }
  getStep(limitType: 'cash' | 'internet'): number {
    const max: number = this.getMaxLimit(
      this.currentSelectedAccount.currency ?? 'PLN',
      limitType
    );
    const min: number = this.getMinLimit(
      this.currentSelectedAccount.currency ?? 'PLN'
    );
    const range: number = max - min;
    const steps: number = Math.ceil(range / 10);
    return range / steps;
  }
  getFee(type: 'monthly' | 'issuance'): string {
    const issuanceAmount: number = this.convertService.getCalculatedAmount(
      this.currentSelectedAccount.currency ?? 'PLN',
      type === 'monthly'
        ? this.currentSelectedCard.fees.release
        : this.currentSelectedCard.fees.monthly
    );
    return (
      issuanceAmount.toString() + ' ' + this.currentSelectedAccount.currency
    );
  }
  getCardImage(currentCard: Card): string {
    return currentCard.id === this.currentSelectedCard.id &&
      this.currentSelectedCard.showingCardSite === 'back'
      ? this.currentSelectedCard.backImage
      : currentCard.image;
  }
  get currentSelectedCard(): Card {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1]
      : this.paginationService.paginatedItems[0];
  }
  get currentSelectedAccount(): Account {
    return this.userAccounts.find(
      (account: Account) => account.id === this.currentSelectedAccountId
    ) as Account;
  }
  get ownerFullName(): string {
    return (
      this.userService.userAccount.name.substring(0, 1) +
      '.' +
      this.userService.userAccount.surname.toUpperCase()
    );
  }
  get cardTypeWithPublisher(): string {
    return (
      this.currentSelectedCard.publisher?.toUpperCase() +
      ' ' +
      this.currentSelectedCard.type
    );
  }
  private setMinTransactionsLimit(): void {
    const accountCurrency: string =
      this.currentSelectedAccount.currency ?? 'PLN';
    const minTransactionsLimit: number =
      accountCurrency === 'PLN'
        ? 500
        : Math.round(this.getMinLimit(accountCurrency));
    this.internetTransactionLimit = minTransactionsLimit;
    this.cashTransactionLimit = minTransactionsLimit;
  }
  private setInternetTransactionLimit(
    upLimit: number,
    downLimit: number
  ): void {
    const isUpperThanLimit: boolean = this.internetTransactionLimit > upLimit;
    const isDownThanLimit: boolean = this.internetTransactionLimit < downLimit;
    if (isUpperThanLimit) {
      this.internetTransactionLimit = Math.round(upLimit);
    } else if (isDownThanLimit) {
      this.internetTransactionLimit = Math.round(downLimit);
    } else {
      this.internetTransactionLimit = Math.round(this.internetTransactionLimit);
    }
  }
  private setCashTransactionLimit(upLimit: number, downLimit: number): void {
    const isUpperThanLimit: boolean = this.cashTransactionLimit > upLimit;
    const isDownThanLimit: boolean = this.cashTransactionLimit < downLimit;
    if (isUpperThanLimit) {
      this.cashTransactionLimit = Math.round(upLimit);
    } else if (isDownThanLimit) {
      this.cashTransactionLimit = Math.round(downLimit);
    } else {
      this.cashTransactionLimit = Math.round(this.cashTransactionLimit);
    }
  }
  private getMinLimit(accountCurrency: string): number {
    return this.convertService.getCalculatedAmount(accountCurrency, 500);
  }
  private getMaxLimit(
    accountCurrency: string,
    type: 'cash' | 'internet'
  ): number {
    return this.convertService.getCalculatedAmount(
      accountCurrency,
      type === 'cash'
        ? this.currentSelectedCard.limits[0].cashTransactions[0]
        : this.currentSelectedCard.limits[0].internetTransactions[0]
    );
  }
  private get cardsObjectsArray(): Card[] {
    return Array.from([
      ...visaCardsObjectsArray,
      ...mastercardCardsObjectsArray,
    ]);
  }
}
