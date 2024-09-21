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
import { CardSettings } from '../../types/card-settings';
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
  protected pinCode: number = 1111;
  protected cardSettings: CardSettings = new CardSettings();
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
  getCardSettingsObject(
    limitType: 'min' | 'max' = 'min',
    transactionType: 'internet' | 'cash' = 'internet'
  ): CardSettings {
    this.setCardAndCurrency(this.cardSettings);
    this.cardSettings.limitType = limitType;
    this.cardSettings.transactionType = transactionType;
    return this.cardSettings;
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
  private setCardAndCurrency(cardSettings: CardSettings): void {
    cardSettings.card = this.currentSelectedCard;
    cardSettings.currency = this.currentSelectedAccount.currency ?? 'PLN';
  }
  private setMinTransactionsLimit(): void {
    const accountCurrency: string =
      this.currentSelectedAccount.currency ?? 'PLN';
    const minTransactionsLimit: number =
      accountCurrency === 'PLN'
        ? 500
        : Math.round(this.convertService.getMinLimit(accountCurrency));
    this.cardSettings.limits.internetTransactionsLimit = minTransactionsLimit;
    this.cardSettings.limits.cashTransactionsLimit = minTransactionsLimit;
  }
  private get cardsObjectsArray(): Card[] {
    return Array.from([
      ...visaCardsObjectsArray,
      ...mastercardCardsObjectsArray,
    ]);
  }
}
