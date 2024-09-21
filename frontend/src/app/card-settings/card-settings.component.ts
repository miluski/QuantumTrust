import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { CardSettings } from '../../types/card-settings';
import { Transaction } from '../../types/transaction';
import { UserAccount } from '../../types/user-account';
import { DurationExpansionComponent } from '../duration-expansion/duration-expansion.component';
import { MobileFiltersComponent } from '../mobile-filters/mobile-filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SortExpansionComponent } from '../sort-expansion/sort-expansion.component';
import { StatusExpansionComponent } from '../status-expansion/status-expansion.component';

@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MobileFiltersComponent,
    SortExpansionComponent,
    DurationExpansionComponent,
    StatusExpansionComponent,
    SearchBarComponent,
    CardIdFormatPipe,
  ],
  animations: [
    trigger('rotateCard', [
      state('front', style({ transform: 'rotateY(0)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front => back', [animate('0.6s')]),
      transition('back => front', [animate('0.6s')]),
    ]),
  ],
  standalone: true,
})
export class CardSettingsComponent implements OnInit {
  protected userAccounts!: Account[];
  protected currentSelectedAccountId!: string;
  protected cardSettings: CardSettings = new CardSettings();
  protected currentSelectedAccount: Account = new Account();
  protected card: Card = new Card();
  protected accountTransactions: Transaction[] = [];
  protected userAccount: UserAccount;
  protected dailyTransactions!: Transaction[][];
  protected newPinCode!: number;
  constructor(
    private userService: UserService,
    private itemSelectionService: ItemSelectionService,
    private appInformationStatesService: AppInformationStatesService,
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
      this.setUserAccounts();
      this.cardSettings.limits.internetTransactionsLimit =
        this.card.limits[0].internetTransactions[0];
      this.cardSettings.limits.cashTransactionsLimit =
        this.card.limits[0].cashTransactions[0];
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
  setCurrentSelectedAccount(newAccountId: string): void {
    this.currentSelectedAccount = this.getFoundedAccount(newAccountId);
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
  private setCardAndCurrency(cardSettings: CardSettings): void {
    cardSettings.card = this.card;
    cardSettings.currency = this.currentSelectedAccount.currency ?? 'PLN';
  }
  private getFoundedAccount(accountId: string | undefined): Account {
    return (
      this.userAccounts.find((account: Account) => account.id === accountId) ??
      this.userAccounts[0]
    );
  }
}
