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
  private userTransactions!: Transaction[];
  private userCards!: Card[];
  protected displayedColumns: string[] = [
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
  private mapUserTransactionsIntoTableTransactions(): void {
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
  private setPaginator(): void {
    this.globalTransactionsFiltersService.tableDataSource.paginator =
      this.paginator;
  }
  private setTableTransactionFields(
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
  private setAccountNumber(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    tableTransaction.accountNumber =
      typeof transaction.accountNumber === 'string'
        ? transaction.accountNumber
        : this.getAccountIdAssignedToCard(transaction.accountNumber);
  }
  private setAmountWithCurrency(
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
  private setDateAndHour(
    transaction: Transaction,
    tableTransaction: TableTransaction
  ): void {
    tableTransaction.dateAndHour = {
      date: transaction.date,
      hour: transaction.hour,
    };
  }
  private sortTableTransactionsArray(): void {
    this.globalTransactionsFiltersService.tableDataSource.data.sort(
      (
        firstTransaction: TableTransaction,
        secondTransaction: TableTransaction
      ) =>
        new Date(secondTransaction.dateAndHour.date).getTime() -
        new Date(firstTransaction.dateAndHour.date).getTime()
    );
  }
  private changeDateFormat(): void {
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
  private getAccountIdAssignedToCard(cardId: number): string {
    const foundedCard: Card = this.userCards.find(
      (card: Card) => card.id === cardId
    ) as Card;
    return foundedCard.assignedAccountId ?? '';
  }
}
