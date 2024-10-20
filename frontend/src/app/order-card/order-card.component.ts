import { Component, HostListener, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { CardFlags } from '../../types/card-flags';
import { CardSettings } from '../../types/card-settings';
import { Currency } from '../../types/currency';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

/**
 * @fileoverview OrderCardComponent is a standalone Angular component that manages the display and interaction
 * with user order cards. It includes functionalities such as pagination, card rotation, input validation,
 * and user account management.
 *
 * @component
 * @selector app-order-card
 * @templateUrl ./order-card.component.html
 * @animations AnimationsProvider.animations
 *
 * @class OrderCardComponent
 * @implements OnInit
 *
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {number} pinCode - Default pin code for the card.
 * @property {CardFlags} cardFlags - Flags indicating the state of various card properties.
 * @property {CardSettings} cardSettings - Settings related to the card.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the card.
 *
 * @constructor
 * @param {VerificationService} verificationService - Service for input validation.
 * @param {UserService} userService - Service to manage user data.
 * @param {PaginationService} paginationService - Service to manage pagination.
 * @param {ConvertService} convertService - Service to handle currency conversion.
 *
 * @method ngOnInit - Lifecycle hook that is called after data-bound properties are initialized.
 * @method onResize - Host listener for window resize events.
 * @method setUserAccounts - Asynchronously sets the user accounts and initializes card settings.
 * @method handleButtonClick - Handles button click events and sets the shake state based on data validity.
 * @method getIsInputValueValid - Validates input values and sets the corresponding flags.
 * @method setDepositAccountNumber - Sets the deposit account number based on user input.
 * @method rotateCard - Rotates the card to show either the front or back side.
 * @method isCardIndexAtCenter - Checks if the card index is at the center.
 * @method getRotateState - Gets the rotate state of the card.
 * @method getCardState - Gets the state of the card based on its index.
 * @method getFee - Calculates and returns the fee based on the type.
 * @method getCardImage - Gets the image of the card based on its current state.
 * @method getCardSettingsObject - Returns the card settings object with specified limits and transaction types.
 * @method currentSelectedCard - Gets the currently selected card.
 * @method currentSelectedAccount - Gets the currently selected account.
 * @method ownerFullName - Gets the full name of the card owner.
 * @method cardTypeWithPublisher - Gets the card type along with its publisher.
 * @method setCardAndCurrency - Sets the card and currency in the card settings.
 * @method setMinTransactionsLimit - Sets the minimum transaction limit based on the current currency.
 * @method setCorrectInputFlag - Sets the correct input flag based on the type and validity.
 * @method currentCurrency - Gets the current currency of the selected account.
 * @method cardsObjectsArray - Gets the array of card objects.
 * @method cardFlagsArray - Gets the array of card flags.
 */
@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  animations: [AnimationsProvider.animations],
})
export class OrderCardComponent implements OnInit {
  public userAccounts!: Account[];
  public pinCode: number = 1111;
  public cardFlags: CardFlags = new CardFlags();
  public cardSettings: CardSettings = new CardSettings();
  public shakeStateService: ShakeStateService = new ShakeStateService();
  constructor(
    private verificationService: VerificationService,
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
    this.cardSettings.assignedAccountNumber = this.userAccounts[0].id;
    this.setMinTransactionsLimit();
  }
  handleButtonClick(): void {
    const isSomeDataInvalid: boolean = this.cardFlagsArray.some(
      (flag: boolean) => flag === false
    );
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }
  getIsInputValueValid(
    input: NgModel,
    type: 'cash' | 'internet' | 'pinCode'
  ): boolean {
    const isValid: boolean = !this.verificationService.validateInput(input);
    this.setCorrectInputFlag(type, isValid);
    return isValid;
  }
  setDepositAccountNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.cardFlags.isAccountNumberValid =
        this.verificationService.validateSelectedAccount(
          this.userAccounts,
          target.value
        );
      this.cardSettings.assignedAccountNumber = this.cardFlags
        .isAccountNumberValid
        ? target.value
        : this.cardSettings.assignedAccountNumber;
    }
  }
  rotateCard(card: Card): void {
    card.showingCardSite =
      card.showingCardSite === 'front' &&
      card.id === this.currentSelectedCard.id
        ? 'back'
        : 'front';
  }
  isCardIndexAtCenter(index: number): boolean {
    return this.currentSelectedCard.id === index;
  }
  getRotateState(card: Card): string {
    const isCardIdSelected: boolean = card.id === this.currentSelectedCard.id;
    const isCardSiteFront: boolean = card.showingCardSite === 'front';
    !isCardIdSelected ? this.rotateCard(card) : null;
    return !isCardIdSelected || isCardSiteFront ? 'front' : 'back';
  }
  getCardState(index: number): string {
    return this.isCardIndexAtCenter(index) ? 'center' : 'default';
  }
  getFee(type: 'monthly' | 'issuance'): string {
    const issuanceAmount: number = this.convertService.getCalculatedAmount(
      this.currentCurrency,
      type === 'monthly'
        ? this.currentSelectedCard.fees.release
        : this.currentSelectedCard.fees.monthly
    );
    return issuanceAmount.toString() + ' ' + this.currentCurrency;
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
    return (
      this.userAccounts &&
      (this.userAccounts.find(
        (account: Account) =>
          account.id === this.cardSettings.assignedAccountNumber
      ) as Account)
    );
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
    cardSettings.currency = this.currentCurrency as Currency;
  }
  private setMinTransactionsLimit(): void {
    const minTransactionsLimit: number =
      this.currentCurrency === 'PLN'
        ? 500
        : Math.round(this.convertService.getMinLimit(this.currentCurrency));
    this.cardSettings.limits.internetTransactionsLimit = minTransactionsLimit;
    this.cardSettings.limits.cashTransactionsLimit = minTransactionsLimit;
  }
  private setCorrectInputFlag(
    type: 'cash' | 'internet' | 'pinCode',
    isValid: boolean
  ): void {
    switch (type) {
      case 'cash':
        this.cardFlags.isCashTransactionsLimitValid = isValid;
        break;
      case 'internet':
        this.cardFlags.isInternetTransactionsLimitValid = isValid;
        break;
      case 'pinCode':
      default:
        this.cardFlags.isPinCodeValid = isValid;
    }
  }
  protected get currentCurrency(): string {
    return (
      (this.currentSelectedAccount && this.currentSelectedAccount.currency) ??
      'PLN'
    );
  }
  private get cardsObjectsArray(): Card[] {
    return Array.from([
      ...visaCardsObjectsArray,
      ...mastercardCardsObjectsArray,
    ]);
  }
  private get cardFlagsArray(): boolean[] {
    return [
      this.cardFlags.isAccountNumberValid,
      this.cardFlags.isCashTransactionsLimitValid,
      this.cardFlags.isInternetTransactionsLimitValid,
      this.cardFlags.isPinCodeValid,
    ];
  }
}
