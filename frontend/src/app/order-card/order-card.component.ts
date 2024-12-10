import { Component, HostListener, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
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
 * @component OrderCardComponent
 * @description This component is responsible for handling the process of ordering a new card.
 *
 * @selector app-order-card
 * @templateUrl ./order-card.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class OrderCardComponent
 * @implements OnInit
 *
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {number} pinCode - The PIN code for the card.
 * @property {CardFlags} cardFlags - Flags indicating the validation status of card fields.
 * @property {CardSettings} cardSettings - The card settings object containing limits and assigned account.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {AlertService} alertService - Service to handle alerts.
 * @param {UserService} userService - Service to manage user data.
 * @param {PaginationService} paginationService - Service to manage pagination.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method setUserAccounts - Sets the user accounts.
 * @method handleButtonClick - Handles the button click event to order a new card.
 * @method getIsInputValueValid - Checks if the input value is valid.
 * @param {NgModel} input - The input model to be validated.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input to be validated.
 * @returns {boolean} - Returns true if the input value is valid, otherwise false.
 * @method setDepositAccountNumber - Sets the account number for the deposit and validates it.
 * @param {Event} event - The input event.
 * @method rotateCard - Rotates the card to show the front or back side.
 * @param {Card} card - The card to be rotated.
 * @method isCardIndexAtCenter - Checks if the card index is at the center.
 * @param {number} index - The index of the card.
 * @returns {boolean} - Returns true if the card index is at the center, otherwise false.
 * @method getRotateState - Gets the rotate state of the card.
 * @param {Card} card - The card to get the rotate state for.
 * @returns {string} - Returns the rotate state of the card.
 * @method getCardState - Gets the state of the card.
 * @param {number} index - The index of the card.
 * @returns {string} - Returns the state of the card.
 * @method getFee - Gets the fee for the card.
 * @param {'monthly' | 'issuance'} type - The type of fee.
 * @returns {string} - Returns the fee for the card.
 * @method getCardImage - Gets the image of the card.
 * @param {Card} currentCard - The current card.
 * @returns {string} - Returns the image of the card.
 * @method getCardSettingsObject - Gets the card settings object with the specified limit type and transaction type.
 * @param {'min' | 'max'} limitType - The limit type, either 'min' or 'max'.
 * @param {'internet' | 'cash'} transactionType - The transaction type, either 'internet' or 'cash'.
 * @returns {CardSettings} - Returns the card settings object.
 * @method currentSelectedCard - Gets the currently selected card.
 * @returns {Card} - Returns the currently selected card.
 * @method currentSelectedAccount - Gets the currently selected account.
 * @returns {Account} - Returns the currently selected account.
 * @method ownerFullName - Gets the full name of the card owner.
 * @returns {string} - Returns the full name of the card owner.
 * @method cardTypeWithPublisher - Gets the card type with the publisher.
 * @returns {string} - Returns the card type with the publisher.
 * @method isBalanceHigherThanFee - Checks if the balance is higher than the fee.
 * @returns {boolean} - Returns true if the balance is higher than the fee, otherwise false.
 * @method setCardAndCurrency - Sets the card and currency in the card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @method setMinTransactionsLimit - Sets the minimum transactions limit.
 * @method setCorrectInputFlag - Sets the correct input flag based on the input type and validity.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input.
 * @param {boolean} isValid - The validity of the input.
 * @method currentCurrency - Gets the current currency of the selected account.
 * @returns {Currency} - Returns the current currency.
 * @method cardsObjectsArray - Gets the array of card objects.
 * @returns {Card[]} - Returns the array of card objects.
 * @method cardFlagsArray - Gets the array of card flags.
 * @returns {boolean[]} - Returns the array of card flags.
 */
@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  animations: [AnimationsProvider.animations],
})
export class OrderCardComponent implements OnInit {
  protected userAccounts!: Account[];

  public pinCode: number;
  public cardFlags: CardFlags;
  public cardSettings: CardSettings;
  public shakeStateService: ShakeStateService;

  constructor(
    private verificationService: VerificationService,
    private alertService: AlertService,
    protected userService: UserService,
    protected paginationService: PaginationService,
    protected convertService: ConvertService
  ) {
    this.pinCode = 1111;
    this.cardFlags = new CardFlags();
    this.cardSettings = new CardSettings();
    this.shakeStateService = new ShakeStateService();
    this.paginationService.paginationMethod = 'movableItems';
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }

  public ngOnInit(): void {
    const cardsArray: Card[] = this.cardsObjectsArray;
    this.paginationService.setPaginatedArray(cardsArray);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
    this.setUserAccounts();
  }

  public setUserAccounts(): void {
    this.userService.userAccounts.subscribe((newAccountsArray: Account[]) => {
      if (newAccountsArray.length >= 1) {
        this.userAccounts = newAccountsArray;
        this.cardSettings.assignedAccountNumber = this.userAccounts[0].id;
      }
    });
    this.setMinTransactionsLimit();
  }

  public handleButtonClick(): void {
    const isBalanceHigherThanFee: boolean = this.isBalanceHigherThanFee();
    let isSomeDataInvalid: boolean = this.cardFlagsArray.some(
      (flag: boolean) => flag === false
    );
    isSomeDataInvalid = isBalanceHigherThanFee === false || isSomeDataInvalid;
    if (isSomeDataInvalid === false) {
      this.userService.setCreatingCardObject(
        this.currentSelectedCard,
        this.cardSettings,
        this.pinCode,
        this.currentSelectedAccount.id,
        this.currentCurrency
      );
      this.userService.operation = 'order-card';
      this.userService.sendVerificationEmail('wyrobienie nowej karty');
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid === true ? 'shake' : 'none'
    );
  }

  public getIsInputValueValid(
    input: NgModel,
    type: 'cash' | 'internet' | 'pinCode'
  ): boolean {
    const isValid: boolean = !this.verificationService.validateInput(input);
    this.setCorrectInputFlag(type, isValid);
    return isValid;
  }

  public setDepositAccountNumber(event: Event) {
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

  public rotateCard(card: Card): void {
    card.showingCardSite =
      card.showingCardSite === 'front' &&
      card.id === this.currentSelectedCard.id
        ? 'back'
        : 'front';
  }

  public isCardIndexAtCenter(index: number): boolean {
    return this.currentSelectedCard.id === index;
  }

  public getRotateState(card: Card): string {
    const isCardIdSelected: boolean = card.id === this.currentSelectedCard.id;
    const isCardSiteFront: boolean = card.showingCardSite === 'front';
    !isCardIdSelected ? this.rotateCard(card) : null;
    return !isCardIdSelected || isCardSiteFront ? 'front' : 'back';
  }

  public getCardState(index: number): string {
    return this.isCardIndexAtCenter(index) ? 'center' : 'default';
  }

  public getFee(type: 'monthly' | 'issuance'): string {
    const issuanceAmount: number = this.convertService.getCalculatedAmount(
      "PLN",
      this.currentCurrency,
      type === 'monthly'
        ? this.currentSelectedCard.fees.monthly
        : this.currentSelectedCard.fees.release
    );
    return issuanceAmount.toString() + ' ' + this.currentCurrency;
  }

  public getCardImage(currentCard: Card): string {
    return currentCard.id === this.currentSelectedCard.id &&
      this.currentSelectedCard.showingCardSite === 'back'
      ? this.currentSelectedCard.backImage
      : currentCard.image;
  }

  public getCardSettingsObject(
    limitType: 'min' | 'max' = 'min',
    transactionType: 'internet' | 'cash' = 'internet'
  ): CardSettings {
    this.setCardAndCurrency(this.cardSettings);
    this.cardSettings.limitType = limitType;
    this.cardSettings.transactionType = transactionType;
    return this.cardSettings;
  }

  public get currentSelectedCard(): Card {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1]
      : this.paginationService.paginatedItems[0];
  }

  public get currentSelectedAccount(): Account {
    return (
      this.userAccounts &&
      (this.userAccounts.find(
        (account: Account) =>
          account.id === this.cardSettings.assignedAccountNumber
      ) as Account)
    );
  }

  public get ownerFullName(): string {
    const firstName: string =
      this.userService.userAccount?.firstName?.substring(0, 1) ?? 'J.';
    const lastName: string =
      this.userService.userAccount?.lastName?.toUpperCase() ?? 'KOWALSKI';
    return firstName + '.' + lastName;
  }

  public get cardTypeWithPublisher(): string {
    return (
      this.currentSelectedCard.publisher?.toUpperCase() +
      ' ' +
      this.currentSelectedCard.type
    );
  }

  private isBalanceHigherThanFee(): boolean {
    const recaltulatedReleaseFee: string = this.getFee('issuance');
    const releaseFeeSubstring: number = Number(
      recaltulatedReleaseFee.split(' ')[0]
    );
    const isBalanceHigherThanFee: boolean =
      (this.currentSelectedAccount?.balance ?? 0) >= releaseFeeSubstring;
    if (!isBalanceHigherThanFee) {
      this.alertService.alertContent =
        'Nie masz wystarczającej kwoty na koncie aby zamówić tę kartę.';
      this.alertService.alertIcon = 'fa-circle-xmark';
      this.alertService.alertTitle = 'Błąd';
      this.alertService.alertType = 'error';
      this.alertService.progressBarBorderColor = '#fca5a5';
      this.alertService.show();
    }
    return isBalanceHigherThanFee;
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

  protected get currentCurrency(): Currency {
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
