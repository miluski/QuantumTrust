import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
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
import { DurationExpansionComponent } from '../duration-expansion/duration-expansion.component';
import { MobileFiltersComponent } from '../mobile-filters/mobile-filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SortExpansionComponent } from '../sort-expansion/sort-expansion.component';
import { StatusExpansionComponent } from '../status-expansion/status-expansion.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  imports: [
    VerificationCodeComponent,
    MobileFiltersComponent,
    SortExpansionComponent,
    DurationExpansionComponent,
    StatusExpansionComponent,
    SearchBarComponent,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    CardIdFormatPipe,
  ],
  animations: [AnimationsProvider.animations],
  standalone: true,
})
export class CardSettingsComponent implements OnInit {
  private originalCard!: Card;
  protected newPinCode!: number;
  protected userAccounts!: Account[];
  protected currentSelectedAccountId!: string;
  protected dailyTransactions!: Transaction[][];
  protected userAccount: UserAccount;
  protected accountTransactions: Transaction[] = [];
  protected card: Card = new Card();
  protected cardFlags: CardFlags = new CardFlags();
  protected cardSettings: CardSettings = new CardSettings();
  protected currentSelectedAccount: Account = new Account();
  protected shakeStateService: ShakeStateService = new ShakeStateService();
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
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
  }
  private setTransactions(): void {
    this.dailyTransactions = this.convertService.getGroupedUserTransactions(
      this.accountTransactions
    );
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
  private isSomeCardDataChanged(): boolean {
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
  private isAccountIdChanged(): boolean {
    return (
      this.cardSettings.assignedAccountNumber !== undefined &&
      this.originalCard.assignedAccountId !==
        this.cardSettings.assignedAccountNumber
    );
  }
  private isCashTransactionsLimitChanged(): boolean {
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
  private isInternetTransactionsLimitChanged(): boolean {
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
  private get cardFlagsArray(): boolean[] {
    return [
      this.cardFlags.isAccountNumberValid,
      this.cardFlags.isCashTransactionsLimitValid,
      this.cardFlags.isInternetTransactionsLimitValid,
      this.cardFlags.isPinCodeValid,
    ];
  }
}
