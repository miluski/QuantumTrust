import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PolishPaginatorProvider } from '../../providers/polish-paginator.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { UserService } from '../../services/user.service';
import { Card } from '../../types/card';
import { TableTransaction } from '../../types/table-transaction';
import { Transaction } from '../../types/transaction';
import { GlobalTransactionsFiltersComponent } from '../global-transactions-filters/global-transactions-filters.component';
import { MobileGlobalTransactionsFiltersComponent } from '../mobile-global-transactions-filters/mobile-global-transactions-filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

/**
 * @fileoverview TransactionsComponent is responsible for displaying and managing user transactions.
 * It fetches user transactions and cards, maps them into a table format, and handles pagination and sorting.
 *
 * @component
 * @selector app-transactions
 * @templateUrl ./transactions.component.html
 * @styleUrl ./transactions.component.css
 * @imports [
 *   CommonModule,
 *   MatTableModule,
 *   MatPaginatorModule,
 *   MatTooltipModule,
 *   SearchBarComponent,
 *   GlobalTransactionsFiltersComponent,
 *   MobileGlobalTransactionsFiltersComponent,
 * ]
 * @providers [
 *   { provide: MatPaginatorIntl, useClass: PolishPaginatorProvider },
 *   DatePipe,
 * ]
 * @standalone true
 *
 * @class TransactionsComponent
 * @implements OnInit
 *
 * @method ngOnInit Lifecycle hook that is called after data-bound properties of a directive are initialized.
 * @method changeTabName Changes the name of the current tab.
 * @param tabName The new name of the tab.
 * @method setUserTransactions Fetches and sets user transactions and cards, then maps them into table transactions.
 * @method setUserCards Fetches and sets user cards.
 * @method mapUserTransactionsIntoTableTransactions Maps user transactions into table transactions and sets the paginator.
 * @method setPaginator Sets the paginator for the table data source.
 * @method setTableTransactionFields Sets the fields of a table transaction based on a user transaction.
 * @param transaction The user transaction.
 * @param tableTransaction The table transaction.
 * @method setAccountNumber Sets the account number for a table transaction.
 * @param transaction The user transaction.
 * @param tableTransaction The table transaction.
 * @method setAmountWithCurrency Sets the amount with currency for a table transaction.
 * @param transaction The user transaction.
 * @param tableTransaction The table transaction.
 * @method setDateAndHour Sets the date and hour for a table transaction.
 * @param transaction The user transaction.
 * @param tableTransaction The table transaction.
 * @method sortTableTransactionsArray Sorts the table transactions array by date.
 * @method changeDateFormat Changes the date format of the table transactions.
 * @method getAccountIdAssignedToCard Gets the account ID assigned to a card.
 * @param cardId The card ID.
 * @returns The account ID assigned to the card.
 */
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    SearchBarComponent,
    GlobalTransactionsFiltersComponent,
    MobileGlobalTransactionsFiltersComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PolishPaginatorProvider },
    DatePipe,
  ],
  standalone: true,
})
export class TransactionsComponent implements OnInit {
  public userTransactions!: Transaction[];
  public userCards!: Card[];
  public displayedColumns: string[] = [
    'Tytuł',
    'Data i godzina',
    'Numer konta',
    'Kwota',
    'Status',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private appInformationStatesService: AppInformationStatesService,
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService,
    protected convertService: ConvertService
  ) {}
  ngOnInit(): void {
    this.setUserTransactions();
  }
  changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }
  async setUserTransactions(): Promise<void> {
    this.userTransactions = await this.userService.getUserTransactionsArray();
    await this.setUserCards();
    this.mapUserTransactionsIntoTableTransactions();
  }
  async setUserCards(): Promise<void> {
    this.userCards = await this.userService.getUserCardsArray();
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
    tableTransaction.accountNumber =
      typeof transaction.accountNumber === 'string'
        ? transaction.accountNumber
        : this.getAccountIdAssignedToCard(transaction.accountNumber);
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
      (card: Card) => card.id === cardId
    ) as Card;
    return foundedCard.assignedAccountId ?? '';
  }
}
