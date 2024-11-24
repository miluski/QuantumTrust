import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { FiltersService } from '../../services/filters.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Transaction } from '../../types/transaction';

/**
 * @component SingleAccountTransactionsComponent
 * @description This component is responsible for displaying and managing transactions for a single account.
 *
 * @selector app-single-account-transactions
 * @templateUrl ./single-account-transactions.component.html
 *
 * @class SingleAccountTransactionsComponent
 * @implements OnInit
 *
 * @property {Account} account - The account object containing account details.
 * @property {number} totalIncomingBalance - The total incoming balance for the account.
 * @property {number} totalOutgoingBalance - The total outgoing balance for the account.
 * @property {Transaction[]} accountTransactions - Array of transactions related to the account.
 * @property {Transaction[][]} dailyTransactions - Array of daily grouped transactions.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ItemSelectionService} itemSelectionService - Service to manage item selection.
 * @param {UserService} userService - Service to manage user data.
 * @param {ChangeDetectorRef} changeDetectorRef - Service to detect changes.
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Resets selected filters and initializes account transactions.
 * @method initializeAccountTransactions - Initializes account transactions by subscribing to the currentAccount observable.
 * @method convertCurrency - Converts the amount from one currency to another.
 * @param {number} amount - The amount to be converted.
 * @param {string} fromCurrency - The currency to convert from.
 * @param {string} toCurrency - The currency to convert to.
 * @returns {number} - Returns the converted amount.
 * @method calculateBalances - Calculates the total incoming and outgoing balances for the account.
 * @method setUserTransactions - Sets the user transactions by subscribing to the userTransactions observable.
 * @method setTransactionsDetails - Sets the details of the transactions, including grouping and sorting.
 * @method calculateTotalIncomingBalance - Calculates the total incoming balance for a transaction.
 * @param {Transaction} transaction - The transaction object.
 * @method calculateTotalOutgoingBalance - Calculates the total outgoing balance for a transaction.
 * @param {Transaction} transaction - The transaction object.
 */
@Component({
  selector: 'app-single-account-transactions',
  templateUrl: './single-account-transactions.component.html',
})
export class SingleAccountTransactionsComponent implements OnInit {
  public account: Account;
  public totalIncomingBalance: number;
  public totalOutgoingBalance: number;
  public accountTransactions: Transaction[];
  public dailyTransactions!: Transaction[][];

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private itemSelectionService: ItemSelectionService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    protected filtersService: FiltersService,
    public convertService: ConvertService
  ) {
    this.account = new Account();
    this.accountTransactions = [];
    this.totalIncomingBalance = 0;
    this.totalOutgoingBalance = 0;
  }

  public ngOnInit(): void {
    this.filtersService.resetSelectedFilters();
    this.initializeAccountTransactions();
    this.changeDetectorRef.detectChanges();
  }

  public initializeAccountTransactions(): void {
    this.itemSelectionService?.currentAccount?.subscribe(
      (account: Account) => (this.account = account)
    );
    this.setUserTransactions();
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

  public setUserTransactions(): void {
      this.userService?.userTransactions?.subscribe(
        (newUserTransactions: Transaction[]) => {
          if (newUserTransactions.length >= 1) {
            this.accountTransactions = newUserTransactions.filter(
              (transaction: Transaction) =>
                this.itemSelectionService.isAccountIdAssignedToCardEqualToItemId(
                  'account',
                  transaction
                ) ||
                this.itemSelectionService.isTransactionAccountIdEqualToItemId(
                  'account',
                  transaction
                )
            );
            this.setTransactionsDetails();
          }
        }
      );
  }

  public setTransactionsDetails(): void {
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

  public calculateTotalIncomingBalance(transaction: Transaction): void {
    this.totalIncomingBalance +=
      transaction.type === 'incoming' && transaction.status === 'settled'
        ? this.convertCurrency(
            transaction.amount,
            transaction.currency,
            this.account.currency as string
          )
        : 0;
  }

  public calculateTotalOutgoingBalance(transaction: Transaction): void {
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
