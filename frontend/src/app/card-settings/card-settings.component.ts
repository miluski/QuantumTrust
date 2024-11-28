import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
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
 * @description This component is responsible for managing card settings, including limits and assigned account.
 *
 * @selector app-card-settings
 * @templateUrl ./card-settings.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class CardSettingsComponent
 * @implements OnInit
 *
 * @property {Card} card - The card object containing card details.
 * @property {Card} originalCard - The original card object for comparison.
 * @property {CardFlags} cardFlags - Flags indicating the validation status of card fields.
 * @property {CardSettings} cardSettings - The card settings object.
 * @property {Account} currentSelectedAccount - The currently selected account.
 * @property {string} currentSelectedAccountId - The ID of the currently selected account.
 * @property {Transaction[]} accountTransactions - Array of transactions related to the account.
 * @property {Transaction[][]} dailyTransactions - Array of daily grouped transactions.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {number} newPinCode - The new PIN code for the card.
 *
 * @constructor
 * @param {ItemSelectionService} itemSelectionService - Service to manage item selection.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {UserService} userService - Service to manage user data.
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * * @method initializeCardTransactions - Initializes card transactions.
 * @method setAccountTransactions - Sets the account transactions.
 * @method setUserAccounts - Sets the user accounts.
 * @method setCurrentSelectedAccount - Sets the currently selected account.
 * @param {Event} event - The event object.
 * @method getIsInputValueValid - Checks if the input value is valid.
 * @param {NgModel} input - The input model.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input.
 * @returns {boolean} - Returns true if the input value is valid, otherwise false.
 * @method getCardSettingsObject - Gets the card settings object.
 * @param {'min' | 'max'} limitType - The limit type.
 * @param {'internet' | 'cash'} transactionType - The transaction type.
 * @returns {CardSettings} - Returns the card settings object.
 * @method handleSaveButtonClick - Handles the save button click event.
 * @method isSomeCardDataChanged - Checks if some card data has changed.
 * @returns {boolean} - Returns true if some card data has changed, otherwise false.
 * @method isAccountIdChanged - Checks if the account ID has changed.
 * @returns {boolean} - Returns true if the account ID has changed, otherwise false.
 * @method isCashTransactionsLimitChanged - Checks if the cash transactions limit has changed.
 * @returns {boolean} - Returns true if the cash transactions limit has changed, otherwise false.
 * @method isInternetTransactionsLimitChanged - Checks if the internet transactions limit has changed.
 * @returns {boolean} - Returns true if the internet transactions limit has changed, otherwise false.
 * @method setTransactions - Sets the transactions.
 * @method getFoundedAccount - Gets the founded account by ID.
 * @param {string | undefined} accountId - The account ID.
 * @returns {Account} - Returns the founded account.
 * @method setCorrectInputFlag - Sets the correct input flag.
 * @param {'cash' | 'internet' | 'pinCode'} type - The type of input.
 * @param {boolean} isValid - The validation status.
 * @method setCardAndCurrency - Sets the card and currency in the card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @property {boolean[]} cardFlagsArray - Array of card flags.
 * @property {boolean} isSaveError - Checks if there is a save error.
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
    const isSomeDataInvalid: boolean =
      this.cardFlagsArray.some((flag: boolean) => flag === false) ||
      !this.isSomeCardDataChanged();
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
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
      this.convertService.getTransactionsLimit(localCardSettings);
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
      this.convertService.getTransactionsLimit(localCardSettings);
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

  protected get isSaveError(): boolean {
    return (
      this.isSomeCardDataChanged() === false &&
      this.shakeStateService.shakeState !== ''
    );
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
