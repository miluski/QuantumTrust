import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PolishPaginatorProvider } from '../../providers/polish-paginator.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { UserService } from '../../services/user.service';
import { Card } from '../../types/card';
import { TableTransaction } from '../../types/table-transaction';
import { Transaction } from '../../types/transaction';

/**
 * @component TransactionsComponent
 * @description This component is responsible for displaying and managing user transactions.
 *
 * @selector app-transactions
 * @templateUrl ./transactions.component.html
 * @styleUrl ./transactions.component.css
 * @providers [
 *   { provide: MatPaginatorIntl, useClass: PolishPaginatorProvider },
 *   DatePipe,
 * ]
 *
 *
 * @class TransactionsComponent
 * @implements OnInit
 *
 * @property {Card[]} userCards - Array of user cards.
 * @property {string[]} displayedColumns - Array of columns to be displayed in the transactions table.
 * @property {Transaction[]} userTransactions - Array of user transactions.
 *
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 * @param {DatePipe} datePipe - Service to format dates.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service to manage global transactions filters.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method setUserTransactions - Sets the user transactions by subscribing to the userTransactions observable.
 * @method setUserCards - Sets the user cards by subscribing to the userCards observable.
 * @method mapUserTransactionsIntoTableTransactions - Maps user transactions into table transactions.
 * @method setPaginator - Sets the paginator for the table data source.
 * @method setTableTransactionFields - Sets the fields of a table transaction based on a user transaction.
 * @param {Transaction} transaction - The user transaction object.
 * @param {TableTransaction} tableTransaction - The table transaction object.
 * @method setAccountNumber - Sets the account number for a table transaction.
 * @param {Transaction} transaction - The user transaction object.
 * @param {TableTransaction} tableTransaction - The table transaction object.
 * @method setAmountWithCurrency - Sets the amount with currency for a table transaction.
 * @param {Transaction} transaction - The user transaction object.
 * @param {TableTransaction} tableTransaction - The table transaction object.
 * @method setDateAndHour - Sets the date and hour for a table transaction.
 * @param {Transaction} transaction - The user transaction object.
 * @param {TableTransaction} tableTransaction - The table transaction object.
 * @method sortTableTransactionsArray - Sorts the table transactions array by date.
 * @method changeDateFormat - Changes the date format for the table transactions.
 * @method getAccountIdAssignedToCard - Gets the account ID assigned to a card.
 * @param {number} cardId - The ID of the card.
 * @returns {string} - Returns the account ID assigned to the card.
 */
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: PolishPaginatorProvider },
    DatePipe,
  ],
})
export class TransactionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public userCards!: Card[];
  public displayedColumns: string[];
  public userTransactions!: Transaction[];

  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private appInformationStatesService: AppInformationStatesService,
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService,
    protected convertService: ConvertService
  ) {
    this.displayedColumns = [
      'Tytuł',
      'Data i godzina',
      'Numer konta',
      'Kwota',
      'Status',
    ];
  }

  public ngOnInit(): void {
    this.setUserTransactions();
  }

  public changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public setUserTransactions(): void {
    this.userService.userTransactions.subscribe(
      (newUserTransactions: Transaction[]) => {
        if (newUserTransactions.length >= 1) {
          this.userTransactions = newUserTransactions;
          this.setUserCards();
          this.mapUserTransactionsIntoTableTransactions();
        }
      }
    );
  }

  public setUserCards(): void {
    this.userService.userCards.subscribe((newUserCards: Card[]) => {
      if (newUserCards.length >= 1) {
        this.userCards = newUserCards;
      }
    });
  }

  public mapUserTransactionsIntoTableTransactions(): void {
    this.globalTransactionsFiltersService.tableDataSource.data = [];
    this.userTransactions.forEach((transaction: Transaction) => {
      const tableTransaction: TableTransaction = new TableTransaction();
      this.setTableTransactionFields(transaction, tableTransaction);
      this.globalTransactionsFiltersService.tableDataSource.data.push(
        tableTransaction
      );
    });
    this.sortTableTransactionsArray();
    this.changeDateFormat();
    this.globalTransactionsFiltersService.setOriginalTableTransactionsArray(
      this.globalTransactionsFiltersService.tableDataSource.data
    );
    this.setPaginator();
  }

  public setPaginator(): void {
    this.globalTransactionsFiltersService.tableDataSource.paginator =
      this.paginator;
  }

  public setTableTransactionFields(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    this.setAccountNumber(transaction, tableTransaction);
    this.setAmountWithCurrency(transaction, tableTransaction);
    this.setDateAndHour(transaction, tableTransaction);
    tableTransaction.status = transaction.status;
    tableTransaction.title = transaction.title;
    tableTransaction.type = transaction.type;
  }

  public setAccountNumber(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    tableTransaction.assignedAccountNumber =
      typeof transaction.assignedAccountNumber === 'string'
        ? transaction.assignedAccountNumber
        : this.getAccountIdAssignedToCard(transaction.assignedAccountNumber);
  }

  public setAmountWithCurrency(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    tableTransaction.amountWithCurrency =
      this.convertService.getNumberWithSpacesBetweenThousands(
        transaction.amount
      ) +
      ' ' +
      transaction.currency;
  }

  public setDateAndHour(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    tableTransaction.dateAndHour = {
      date: transaction.date,
      hour: transaction.hour,
    };
  }

  public sortTableTransactionsArray(): void {
    this.globalTransactionsFiltersService.tableDataSource.data.sort(
      (
        firstTransaction: TableTransaction,
        secondTransaction: TableTransaction
      ) =>
        new Date(secondTransaction.dateAndHour.date).getTime() -
        new Date(firstTransaction.dateAndHour.date).getTime()
    );
  }

  public changeDateFormat(): void {
    const dateFormatRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    this.globalTransactionsFiltersService.tableDataSource.data.forEach(
      (transaction: TableTransaction) => {
        if (!dateFormatRegex.test(transaction.dateAndHour.date)) {
          transaction.dateAndHour.date =
            this.datePipe.transform(
              transaction.dateAndHour.date,
              'dd.MM.yyyy'
            ) ?? '';
        }
      }
    );
  }

  public getAccountIdAssignedToCard(cardId: number): string {
    const foundedCard: Card = this.userCards.find(
      (card: Card) => Number(card.id) === cardId
    ) as Card;
    return foundedCard.assignedAccountNumber ?? '';
  }
}
