import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { Deposit } from '../../types/deposit';
import { Transaction } from '../../types/transaction';
import { UserAccount } from '../../types/user-account';

/**
 * @file finances.component.ts
 * @description This component handles the finances view of the application, including user accounts, deposits, transactions, and cards.
 * It provides functionalities such as pagination, transaction grouping, and responsive design handling.
 *
 * @component
 * @selector app-finances
 * @templateUrl ./finances.component.html
 * @styleUrl ./finances.component.css
 * @imports CommonModule, RouterModule, MatIconModule, MatTooltipModule, CardIdFormatPipe
 * @animations AnimationsProvider.animations
 * @standalone true
 *
 * @class FinancesComponent
 * @implements OnInit
 *
 * @property {UserAccount} userAccount - The current user's account.
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {Deposit[]} userDeposits - Array of user deposits.
 * @property {Transaction[]} userTransactions - Array of user transactions.
 * @property {Card[]} userCards - Array of user cards.
 * @property {Transaction[][]} dailyTransactions - Grouped daily transactions.
 * @property {PaginationService} accountsPaginationService - Service for paginating user accounts.
 * @property {PaginationService} cardPaginationService - Service for paginating user cards.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service for managing application state.
 * @param {UserService} userService - Service for managing user data.
 * @param {ItemSelectionService} itemSelectionService - Service for managing item selection.
 * @param {ConvertService} convertService - Service for converting data.
 *
 * @method ngOnInit - Lifecycle hook that is called after data-bound properties are initialized.
 * @method initializeUserData - Initializes user data by fetching accounts, deposits, transactions, and cards.
 * @method setPaginatedArrays - Sets paginated arrays for accounts and cards.
 * @method handleWidthChange - Handles changes in window width for responsive design.
 * @method onResize - Host listener for window resize events.
 * @method groupUserTransactions - Groups user transactions by day.
 * @method changeTabName - Changes the name of the current tab.
 * @method getDayAndMonthFromDate - Extracts and formats the day and month from a date string.
 * @method setSelectedAccount - Sets the selected account.
 * @method setSelectedCard - Sets the selected card.
 * @method getShortenedAccountNumber - Shortens the account number in a transaction.
 * @method filterTransactions - Filters transactions to include only those from today or yesterday.
 */
@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    CardIdFormatPipe,
  ],
  animations: [AnimationsProvider.animations],
  standalone: true,
})
export class FinancesComponent implements OnInit {
  public userAccounts!: Account[];
  public userTransactions!: Transaction[];
  public userCards!: Card[];
  public accountsPaginationService: PaginationService = new PaginationService();
  public cardPaginationService: PaginationService = new PaginationService();
  protected userAccount: UserAccount;
  protected userDeposits!: Deposit[];
  protected dailyTransactions: Transaction[][] = [[]];
  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private userService: UserService,
    private itemSelectionService: ItemSelectionService,
    public convertService: ConvertService
  ) {
    this.userAccount = userService.userAccount;
  }
  ngOnInit(): void {
    this.initializeUserData();
  }
  async initializeUserData(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.userDeposits = await this.userService.getUserDepositsArray();
    this.userTransactions = await this.userService.getUserTransactionsArray();
    this.userCards = await this.userService.getUserCardsArray();
    this.setPaginatedArrays();
    this.handleWidthChange();
    this.filterTransactions();
    this.groupUserTransactions();
  }
  setPaginatedArrays(): void {
    this.accountsPaginationService.setPaginatedArray(this.userAccounts);
    this.cardPaginationService.setPaginatedArray(this.userCards);
    this.cardPaginationService.setLargeBreakpointItemsPerPage(4);
  }
  handleWidthChange(): void {
    this.accountsPaginationService.handleWidthChange(window.innerWidth);
    this.cardPaginationService.handleWidthChange(window.innerWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.accountsPaginationService.onResize(event);
    this.cardPaginationService.onResize(event);
  }
  groupUserTransactions(): void {
    this.dailyTransactions = this.convertService.getGroupedUserTransactions(
      this.userTransactions
    );
    this.dailyTransactions.forEach((transactionArray: Transaction[]) => {
      transactionArray.splice(2);
    });
  }
  changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }
  getDayAndMonthFromDate(date: string): string {
    const today: Date = new Date();
    const convertedDate: Date = new Date(date);
    const period =
      convertedDate.getDate() === today.getDate() ? 'Dzisiaj, ' : ' Wczoraj, ';
    const originalDay: number = convertedDate.getUTCDate();
    const originalMonth: number = convertedDate.getUTCMonth() + 1;
    const day: string =
      originalDay < 10 ? '0' + originalDay : originalDay.toString();
    const month: string =
      originalMonth < 10 ? '0' + originalMonth : originalMonth.toString();
    return period + day + '.' + month;
  }
  setSelectedAccount(account: Account): void {
    this.itemSelectionService.setSelectedAccount(account);
  }
  setSelectedCard(card: Card): void {
    this.itemSelectionService.setSelectedCard(card);
  }
  getShortenedAccountNumber(transaction: Transaction): string {
    return typeof transaction.accountNumber === 'string'
      ? transaction.accountNumber.slice(31)
      : transaction.accountNumber.toString();
  }
  public filterTransactions(): void {
    this.userTransactions = this.userTransactions.filter(
      (transaction: Transaction) => {
        new Date().getDate() === new Date(transaction.date).getDate() ||
          new Date().getDate() - 1 === new Date(transaction.date).getDate();
      }
    );
  }
}
