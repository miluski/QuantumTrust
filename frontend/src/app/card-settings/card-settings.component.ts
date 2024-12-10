import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { CardFlags } from '../../types/card-flags';
import { CardSettings } from '../../types/card-settings';
import { Transaction } from '../../types/transaction';

/**
 * @component CardSettingsComponent
 * @description This component is responsible for managing card settings, including limits, PIN code, and assigned account.
 *
 * @selector app-card-settings
 * @templateUrl ./card-settings.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class CardSettingsComponent
 * @implements OnInit
 *
 * @property {Card} card - The card object containing card details.
 * @property {number} newPinCode - The new PIN code for the card.
 * @property {Card} originalCard - The original card object for comparison.
 * @property {CardFlags} cardFlags - Flags indicating the validation status of card fields.
 * @property {Account[]} userAccounts - An array of user accounts.
 * @property {CardSettings} cardSettings - The card settings object containing limits and assigned account.
 * @property {Account} currentSelectedAccount - The currently selected account.
 * @property {string} currentSelectedAccountId - The ID of the currently selected account.
 * @property {Transaction[]} accountTransactions - An array of transactions for the selected account.
 * @property {Transaction[][]} dailyTransactions - A 2D array of daily transactions.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {AlertService} alertService - Service to handle alerts.
 * @param {ItemSelectionService} itemSelectionService - Service to manage item selection.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {UserService} userService - Service to manage user data.
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Resets selected filters and initializes card transactions.
 * @method initializeCardTransactions - Initializes card transactions and sets user accounts and account transactions.
 * @method setUserAccounts - Sets the user accounts and the currently selected account.
 * @method setAccountTransactions - Sets the account transactions and groups them by date.
 * @method setCurrentSelectedAccount - Sets the currently selected account and validates the account number.
 * @method getIsInputValueValid - Checks if the input value is valid.
 * @param {NgModel} input - The input model to be validated.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input to be validated.
 * @returns {boolean} - Returns true if the input value is valid, otherwise false.
 * @method getCardSettingsObject - Gets the card settings object with the specified limit type and transaction type.
 * @param {'min' | 'max'} limitType - The limit type, either 'min' or 'max'.
 * @param {'internet' | 'cash'} transactionType - The transaction type, either 'internet' or 'cash'.
 * @returns {CardSettings} - Returns the card settings object.
 * @method handleSaveButtonClick - Handles the save button click event and updates the card settings.
 * @method isSomeCardDataChanged - Checks if some card data has changed.
 * @returns {boolean} - Returns true if some card data has changed, otherwise false.
 * @method isAccountIdChanged - Checks if the account ID has changed.
 * @returns {boolean} - Returns true if the account ID has changed, otherwise false.
 * @method isCashTransactionsLimitChanged - Checks if the cash transactions limit has changed.
 * @returns {boolean} - Returns true if the cash transactions limit has changed, otherwise false.
 * @method isInternetTransactionsLimitChanged - Checks if the internet transactions limit has changed.
 * @returns {boolean} - Returns true if the internet transactions limit has changed, otherwise false.
 * @method setTransactions - Sets the transactions and groups them by date.
 * @method getFoundedAccount - Gets the account with the specified ID.
 * @param {string | undefined} accountId - The ID of the account to be found.
 * @returns {Account} - Returns the found account.
 * @method setCorrectInputFlag - Sets the correct input flag based on the input type and validity.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input.
 * @param {boolean} isValid - The validity of the input.
 * @method trackByUserId - Tracks the user account by ID.
 * @param {number} _ - The index of the user account.
 * @param {Account} userAccount - The user account to be tracked.
 * @returns {string} - Returns the ID of the user account.
 * @method currentInternetTransactionsLimit - Gets the current internet transactions limit.
 * @returns {number} - Returns the current internet transactions limit.
 * @method currentCashTransactionsLimit - Gets the current cash transactions limit.
 * @returns {number} - Returns the current cash transactions limit.
 * @method changeCardStatus - Changes the status of the card.
 * @method currentCurrency - Gets the current currency of the selected account.
 * @returns {string} - Returns the current currency.
 * @method isSaveError - Checks if there is a save error.
 * @returns {boolean} - Returns true if there is a save error, otherwise false.
 * @method showAlert - Shows an alert with an error message.
 * @method setCardAndCurrency - Sets the card and currency in the card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @method cardFlagsArray - Gets the array of card flags.
 * @returns {boolean[]} - Returns an array of card flags.
 */
@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  animations: [AnimationsProvider.animations],
})
export class CardSettingsComponent implements OnInit {
  public card: Card;
  public newPinCode!: number;
  public originalCard!: Card;
  public cardFlags: CardFlags;
  public userAccounts!: Account[];
  public cardSettings: CardSettings;
  public currentSelectedAccount: Account;
  public currentSelectedAccountId!: string;
  public accountTransactions: Transaction[];
  public dailyTransactions: Transaction[][];
  public shakeStateService: ShakeStateService;

  constructor(
    private alertService: AlertService,
    private itemSelectionService: ItemSelectionService,
    private appInformationStatesService: AppInformationStatesService,
    private verificationService: VerificationService,
    protected userService: UserService,
    protected filtersService: FiltersService,
    protected convertService: ConvertService
  ) {
    this.card = new Card();
    this.cardFlags = new CardFlags();
    this.cardSettings = new CardSettings();
    this.currentSelectedAccount = new Account();
    this.accountTransactions = [];
    this.dailyTransactions = [];
    this.shakeStateService = new ShakeStateService();
  }

  public ngOnInit(): void {
    this.filtersService.resetSelectedFilters();
    this.initializeCardTransactions();
  }

  public initializeCardTransactions(): void {
    this.itemSelectionService.currentCard.subscribe((currentCard: Card) => {
      this.card = currentCard;
      this.originalCard = JSON.parse(JSON.stringify(currentCard));
      this.setUserAccounts();
      this.setAccountTransactions();
      this.cardSettings.limits.internetTransactionsLimit =
        this.card.limits && this.card.limits[0].internetTransactions[0];
      this.cardSettings.limits.cashTransactionsLimit =
        this.card.limits && this.card.limits[0].cashTransactions[0];
    });
  }

  public setUserAccounts(): void {
    this.userService.userAccounts.subscribe((newUserAccounts: Account[]) => {
      if (newUserAccounts.length >= 1) {
        this.userAccounts = newUserAccounts;
        this.currentSelectedAccount = this.getFoundedAccount(
          this.card.assignedAccountNumber
        );
        this.currentSelectedAccountId = this.currentSelectedAccount.id;
      }
    });
  }

  public setAccountTransactions(): void {
    this.userService.userTransactions.subscribe(
      (newUserTransactions: Transaction[]) => {
        if (newUserTransactions.length >= 1) {
          this.accountTransactions = newUserTransactions.filter(
            (transaction: Transaction) =>
              this.itemSelectionService.isAccountIdAssignedToCardEqualToItemId(
                'card',
                transaction
              ) ||
              this.itemSelectionService.isTransactionAccountIdEqualToItemId(
                'card',
                transaction
              )
          );
          this.setTransactions();
        }
      }
    );
  }

  public setCurrentSelectedAccount(account: Account) {
    if (account) {
      this.cardFlags.isAccountNumberValid =
        this.verificationService.validateSelectedAccount(
          this.userAccounts,
          account.id
        );
      this.cardSettings.assignedAccountNumber = this.cardFlags
        .isAccountNumberValid
        ? account.id
        : this.cardSettings.assignedAccountNumber;
      this.currentSelectedAccount = this.getFoundedAccount(
        this.cardSettings.assignedAccountNumber
      );
    }
  }

  public getIsInputValueValid(
    input: NgModel,
    type: 'cash' | 'internet' | 'pinCode'
  ): boolean {
    const isValid: boolean = !this.verificationService.validateInput(input);
    this.setCorrectInputFlag(type, isValid);
    return isValid;
  }

  public getCardSettingsObject(
    limitType: 'min' | 'max' = 'min',
    transactionType: 'internet' | 'cash' = 'internet'
  ): CardSettings {
    this.setCardAndCurrency(this.cardSettings);
    this.cardSettings.limitType = limitType;
    this.cardSettings.transactionType = transactionType;
    this.cardSettings.site = 'card-settings';
    return this.cardSettings;
  }

  public handleSaveButtonClick(): void {
    if (this.card.status === 'unsuspended') {
      const isSomeDataInvalid: boolean =
        this.cardFlagsArray.some((flag: boolean) => flag === false) ||
        !this.isSomeCardDataChanged();
      const isPinCodeChanged: boolean =
        this.newPinCode !== undefined && this.cardFlagsArray[3] === true;
      if (isSomeDataInvalid === false || isPinCodeChanged) {
        this.userService.operation = 'edit-card';
        this.card.limits[0].internetTransactions[0] =
          this.cardSettings.limits.internetTransactionsLimit;
        this.card.limits[0].cashTransactions[0] =
          this.cardSettings.limits.cashTransactionsLimit;
        this.card.assignedAccountNumber =
          this.cardSettings.assignedAccountNumber !== undefined
            ? this.cardSettings.assignedAccountNumber
            : this.card.assignedAccountNumber;
        this.card.pin =
          this.newPinCode !== undefined ? this.newPinCode : this.card.pin;
        this.userService.sendVerificationEmail('edycję danych karty');
        this.userService.setEditingCard(this.card);
      }
      this.shakeStateService.setCurrentShakeState(
        isSomeDataInvalid ? 'shake' : 'none'
      );
    } else {
      this.showAlert();
    }
  }

  public isSomeCardDataChanged(): boolean {
    const isAccountIdChanged: boolean = this.isAccountIdChanged();
    const isCashLimitChanged: boolean = this.isCashTransactionsLimitChanged();
    const isInternetLimitChanged: boolean =
      this.isInternetTransactionsLimitChanged();
    return (
      isAccountIdChanged ||
      isCashLimitChanged ||
      isInternetLimitChanged ||
      this.newPinCode !== undefined
    );
  }

  public isAccountIdChanged(): boolean {
    return (
      this.cardSettings.assignedAccountNumber !== undefined &&
      this.originalCard.assignedAccountNumber !==
        this.cardSettings.assignedAccountNumber
    );
  }

  public isCashTransactionsLimitChanged(): boolean {
    const localCardSettings: CardSettings = new CardSettings();
    localCardSettings.card = this.originalCard;
    localCardSettings.limitType = 'max';
    localCardSettings.currency = this.cardSettings.currency;
    const convertedOriginalLimit: number =
      this.convertService.getTransactionsLimit(
        localCardSettings,
        localCardSettings.currency
      );
    return (
      this.cardSettings.limits.cashTransactionsLimit !== undefined &&
      this.cardSettings.limits.cashTransactionsLimit !== convertedOriginalLimit
    );
  }

  public isInternetTransactionsLimitChanged(): boolean {
    const localCardSettings: CardSettings = new CardSettings();
    localCardSettings.card = this.originalCard;
    localCardSettings.limitType = 'max';
    localCardSettings.transactionType = 'internet';
    localCardSettings.currency = this.cardSettings.currency;
    const convertedOriginalLimit: number =
      this.convertService.getTransactionsLimit(
        localCardSettings,
        localCardSettings.currency
      );
    return (
      this.cardSettings.limits.internetTransactionsLimit !== undefined &&
      this.cardSettings.limits.internetTransactionsLimit !==
        convertedOriginalLimit
    );
  }

  public setTransactions(): void {
    this.dailyTransactions =
      this.convertService.getGroupedUserTransactions(
        this.accountTransactions
      ) || [];
    this.filtersService.sortByDate(this.dailyTransactions, 'asc');
    this.filtersService.setOriginalTransactionsArray([
      ...this.dailyTransactions,
    ]);
    this.appInformationStatesService.changeTransactionsArrayLength(
      this.accountTransactions.length
    );
  }

  public getFoundedAccount(accountId: string | undefined): Account {
    return (
      this.userAccounts &&
      (this.userAccounts.find((account: Account) => account.id === accountId) ??
        this.userAccounts[0])
    );
  }

  public setCorrectInputFlag(
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

  public trackByUserId(_: number, userAccount: Account): string {
    return userAccount.id;
  }

  public get currentInternetTransactionsLimit(): number {
    const limit: number = this.cardSettings.limits.internetTransactionsLimit;
    const minLimit: number = this.convertService.getTransactionsLimit(
      this.getCardSettingsObject(),
      'PLN'
    );
    const maxLimit: number = this.convertService.getTransactionsLimit(
      this.getCardSettingsObject('max'),
      'PLN'
    );
    const isLimitHigherThanMaximum: boolean = limit > maxLimit;
    const isLimitLowerThanMinimum: boolean = limit < minLimit;
    const currentLimit: number = isLimitHigherThanMaximum
      ? maxLimit
      : isLimitLowerThanMinimum
      ? minLimit
      : limit;
    this.cardSettings.limits.internetTransactionsLimit =
      Math.round(currentLimit);
    return Math.round(currentLimit);
  }

  public get currentCashTransactionsLimit(): number {
    const limit: number = this.cardSettings.limits.cashTransactionsLimit;
    const minLimit: number = this.convertService.getTransactionsLimit(
      this.getCardSettingsObject('min', 'cash'),
      'PLN'
    );
    const maxLimit: number = this.convertService.getTransactionsLimit(
      this.getCardSettingsObject('max', 'cash'),
      'PLN'
    );
    const isLimitHigherThanMaximum: boolean = limit > maxLimit;
    const isLimitLowerThanMinimum: boolean = limit < minLimit;
    const currentLimit: number = isLimitHigherThanMaximum
      ? maxLimit
      : isLimitLowerThanMinimum
      ? minLimit
      : limit;
    this.cardSettings.limits.cashTransactionsLimit = Math.round(currentLimit);
    return Math.round(currentLimit);
  }

  protected changeCardStatus(): void {
    this.userService.operation =
      this.card.status === 'suspended'
        ? 'unsuspend-card'
        : this.card.status === 'unsuspended'
        ? 'suspend-card'
        : '';
    this.userService.sendVerificationEmail('zmianę statusu karty');
    this.userService.setEditingCard(this.card);
    this.shakeStateService.setCurrentShakeState('none');
  }

  protected get currentCurrency(): string {
    return (
      (this.currentSelectedAccount && this.currentSelectedAccount.currency) ??
      'PLN'
    );
  }

  protected get isSaveError(): boolean {
    return (
      this.isSomeCardDataChanged() === false &&
      this.shakeStateService.shakeState !== ''
    );
  }

  private showAlert(): void {
    this.alertService.alertType = 'error';
    this.alertService.alertIcon = 'fa-circle-xmark';
    this.alertService.alertTitle = 'Błąd!';
    this.alertService.alertContent =
      'Nie możesz edytować danych tej karty, gdyż jest zawieszona!';
    this.alertService.progressBarBorderColor = '#fca5a5';
    this.alertService.show();
  }

  private setCardAndCurrency(cardSettings: CardSettings): void {
    cardSettings.card = this.card;
    cardSettings.currency =
      (this.currentSelectedAccount && this.currentSelectedAccount.currency) ??
      'PLN';
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