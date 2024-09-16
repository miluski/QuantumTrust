import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';
import { DurationExpansionComponent } from '../duration-expansion/duration-expansion.component';
import { MobileFiltersComponent } from '../mobile-filters/mobile-filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SingleAccountBalanceChartComponent } from '../single-account-balance-chart/single-account-balance-chart.component';
import { SortExpansionComponent } from '../sort-expansion/sort-expansion.component';
import { StatusExpansionComponent } from '../status-expansion/status-expansion.component';

@Component({
  selector: 'app-single-account-transactions',
  templateUrl: './single-account-transactions.component.html',
  imports: [
    CommonModule,
    RouterModule,
    SingleAccountBalanceChartComponent,
    SortExpansionComponent,
    DurationExpansionComponent,
    StatusExpansionComponent,
    SearchBarComponent,
    MobileFiltersComponent,
    MatRadioButton,
    DatePipe,
  ],
  standalone: true,
})
export class SingleAccountTransactionsComponent implements OnInit {
  account: Account = new Account();
  accountTransactions: Transaction[] = [];
  dailyTransactions!: Transaction[][];
  totalIncomingBalance: number = 0;
  totalOutgoingBalance: number = 0;
  constructor(
    private itemSelectionService: ItemSelectionService,
    private changeDetectorRef: ChangeDetectorRef,
    private appInformationStatesService: AppInformationStatesService,
    protected filtersService: FiltersService,
    public convertService: ConvertService
  ) {}
  ngOnInit(): void {
    this.initializeAccountTransactions();
    this.changeDetectorRef.detectChanges();
  }
  getDayFromDate(date: string): string {
    return this.convertService.getWeekDayFromNumber(new Date(date).getDay());
  }
  async initializeAccountTransactions(): Promise<void> {
    this.itemSelectionService.currentAccount.subscribe(
      (account: Account) => (this.account = account)
    );
    this.accountTransactions =
      await this.itemSelectionService.getUserTransactions();
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
    this.calculateBalances();
  }
  private calculateBalances(): void {
    this.accountTransactions.forEach((transaction: Transaction) => {
      this.calculateTotalIncomingBalance(transaction);
      this.calculateTotalOutgoingBalance(transaction);
    });
  }
  private calculateTotalIncomingBalance(transaction: Transaction): void {
    this.totalIncomingBalance +=
      transaction.type === 'incoming' && transaction.status === 'settled'
        ? this.convertCurrency(
            transaction.amount,
            transaction.currency,
            this.account.currency as string
          )
        : 0;
  }
  private calculateTotalOutgoingBalance(transaction: Transaction): void {
    this.totalOutgoingBalance +=
      transaction.type === 'outgoing' && transaction.status === 'settled'
        ? this.convertCurrency(
            transaction.amount,
            transaction.currency,
            this.account.currency as string
          )
        : 0;
  }
  private convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number {
    const conversionRate = this.convertService.getConversionRate(
      fromCurrency,
      toCurrency
    );
    return parseFloat((amount * conversionRate).toFixed(2));
  }
}
