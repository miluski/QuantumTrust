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
import { UserAccount } from '../../types/user-account';

/**
 * @fileoverview CardSettingsComponent is a standalone Angular component that manages the settings of a user's card.
 * It includes functionalities such as initializing card transactions, setting user accounts, validating input values,
 * and handling save button clicks.
 *
 * @component
 * @selector app-card-settings
 * @templateUrl ./card-settings.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class
 * @implements OnInit
 *
 * @method ngOnInit Initializes the component and sets up card transactions.
 * @method initializeCardTransactions Initializes card transactions and sets user accounts.
 * @method setUserAccounts Sets the user accounts for the card.
 * @method setCurrentSelectedAccount Sets the currently selected account based on user input.
 * @method getIsInputValueValid Validates the input value and sets the corresponding flag.
 * @method getCardSettingsObject Returns the card settings object based on the specified limit and transaction type.
 * @method handleSaveButtonClick Handles the save button click event and sets the shake state.
 * @method setTransactions Sets the transactions for the card.
 * @method setCorrectInputFlag Sets the correct input flag based on the type and validity.
 * @method setCardAndCurrency Sets the card and currency for the card settings.
 * @method getFoundedAccount Returns the account that matches the specified account ID.
 * @method isSaveError Checks if there is an error in saving the card settings.
 * @method isSomeCardDataChanged Checks if any card data has been changed.
 * @method isAccountIdChanged Checks if the account ID has been changed.
 * @method isCashTransactionsLimitChanged Checks if the cash transactions limit has been changed.
 * @method isInternetTransactionsLimitChanged Checks if the internet transactions limit has been changed.
 * @method cardFlagsArray Returns an array of card flags.
 */
@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  animations: [AnimationsProvider.animations],
})
export class CardSettingsComponent implements OnInit {
  public originalCard!: Card;
  public userAccounts!: Account[];
  public currentSelectedAccountId!: string;
  public card: Card = new Card();
  public cardFlags: CardFlags = new CardFlags();
  public cardSettings: CardSettings = new CardSettings();
  public currentSelectedAccount: Account = new Account();
  public accountTransactions: Transaction[] = [];
  public dailyTransactions: Transaction[][] = [];
  public shakeStateService: ShakeStateService = new ShakeStateService();
  protected newPinCode!: number;
  protected userAccount: UserAccount;
  constructor(
    private userService: UserService,
    private itemSelectionService: ItemSelectionService,
    private appInformationStatesService: AppInformationStatesService,
    private verificationService: VerificationService,
    protected filtersService: FiltersService,
    protected convertService: ConvertService
  ) {
    this.userAccount = userService.userAccount;
  }
  ngOnInit(): void {
    this.filtersService.resetSelectedFilters();
    this.initializeCardTransactions();
  }
  async initializeCardTransactions(): Promise<void> {
    this.itemSelectionService.currentCard.subscribe((currentCard: Card) => {
      this.card = currentCard;
      this.originalCard = JSON.parse(JSON.stringify(currentCard));
      this.setUserAccounts();
      this.cardSettings.limits.internetTransactionsLimit =
        this.card.limits && this.card.limits[0].internetTransactions[0];
      this.cardSettings.limits.cashTransactionsLimit =
        this.card.limits && this.card.limits[0].cashTransactions[0];
    });
    this.accountTransactions =
      await this.itemSelectionService.getUserTransactions('card');
    this.setTransactions();
  }
  async setUserAccounts(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.currentSelectedAccount = this.getFoundedAccount(
      this.card.assignedAccountId
    );
    this.currentSelectedAccountId = this.currentSelectedAccount.id;
  }
  setCurrentSelectedAccount(event: Event) {
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
      this.currentSelectedAccount = this.getFoundedAccount(
        this.cardSettings.assignedAccountNumber
      );
    }
  }
  getIsInputValueValid(
    input: NgModel,
    type: 'cash' | 'internet' | 'pinCode'
  ): boolean {
    const isValid: boolean = !this.verificationService.validateInput(input);
    this.setCorrectInputFlag(type, isValid);
    return isValid;
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
  handleSaveButtonClick(): void {
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
      this.originalCard.assignedAccountId !==
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
  private setCardAndCurrency(cardSettings: CardSettings): void {
    cardSettings.card = this.card;
    cardSettings.currency =
      (this.currentSelectedAccount && this.currentSelectedAccount.currency) ??
      'PLN';
  }
  private getFoundedAccount(accountId: string | undefined): Account {
    return (
      this.userAccounts &&
      (this.userAccounts.find((account: Account) => account.id === accountId) ??
        this.userAccounts[0])
    );
  }
  protected get isSaveError(): boolean {
    return (
      this.isSomeCardDataChanged() === false &&
      this.shakeStateService.shakeState !== ''
    );
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
