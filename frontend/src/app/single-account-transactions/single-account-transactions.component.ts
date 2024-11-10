import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';

/**
 * Component for displaying and managing single account transactions.
 *
 * @component
 * @selector app-single-account-transactions
 * @templateUrl ./single-account-transactions.component.html
 *
 * @class SingleAccountTransactionsComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} dailyTransactions - Grouped daily transactions.
 * @property {Account} account - The account associated with the transactions.
 * @property {Transaction[]} accountTransactions - List of transactions for the account.
 * @property {number} totalIncomingBalance - Total incoming balance.
 * @property {number} totalOutgoingBalance - Total outgoing balance.
 *
 * @constructor
 * @param {ItemSelectionService} itemSelectionService - Service for item selection.
 * @param {ChangeDetectorRef} changeDetectorRef - Service to detect changes.
 * @param {AppInformationStatesService} appInformationStatesService - Service for app state management.
 * @param {FiltersService} filtersService - Service for filtering transactions.
 * @param {ConvertService} convertService - Service for currency conversion.
 *
 * @method ngOnInit - Initializes the component and loads account transactions.
 * @method initializeAccountTransactions - Loads and processes account transactions.
 * @method calculateBalances - Calculates the total incoming and outgoing balances.
 * @method calculateTotalIncomingBalance - Calculates the total incoming balance for a given transaction.
 * @method calculateTotalOutgoingBalance - Calculates the total outgoing balance for a given transaction.
 * @method convertCurrency - Converts a given amount from one currency to another.
 */
@Component({
  selector: 'app-single-account-transactions',
  templateUrl: './single-account-transactions.component.html',
})
export class SingleAccountTransactionsComponent implements OnInit {
  public dailyTransactions!: Transaction[][];
  public account: Account = new Account();
  public accountTransactions: Transaction[] = [];
  public totalIncomingBalance: number = 0;
  public totalOutgoingBalance: number = 0;
  constructor(
    private itemSelectionService: ItemSelectionService,
    private changeDetectorRef: ChangeDetectorRef,
    private appInformationStatesService: AppInformationStatesService,
    protected filtersService: FiltersService,
    public convertService: ConvertService
  ) {}
  ngOnInit(): void {
    this.filtersService.resetSelectedFilters();
    this.initializeAccountTransactions();
    this.changeDetectorRef.detectChanges();
  }
  async initializeAccountTransactions(): Promise<void> {
    this.itemSelectionService.currentAccount.subscribe(
      (account: Account) => (this.account = account)
    );
    this.accountTransactions =
      await this.itemSelectionService.getUserTransactions('account');
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
  public calculateBalances(): void {
    this.accountTransactions.forEach((transaction: Transaction) => {
      this.calculateTotalIncomingBalance(transaction);
      this.calculateTotalOutgoingBalance(transaction);
    });
  }
  public convertCurrency(
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
}
