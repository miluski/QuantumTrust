import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
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

/**
 * @component FinancesComponent
 * @description This component is responsible for displaying and managing user finances, including accounts, cards, deposits, and transactions.
 *
 * @selector app-finances
 * @templateUrl ./finances.component.html
 * @styleUrl ./finances.component.css
 * @animations [AnimationsProvider.animations]
 *
 * @class FinancesComponent
 * @implements OnInit
 *
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {Deposit[]} userDeposits - Array of user deposits.
 * @property {Transaction[][]} dailyTransactions - Array of daily grouped transactions.
 * @property {Card[]} userCards - Array of user cards.
 * @property {Transaction[]} userTransactions - Array of user transactions.
 * @property {PaginationService} cardPaginationService - Service to manage pagination for cards.
 * @property {PaginationService} accountsPaginationService - Service to manage pagination for accounts.
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a browser.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ItemSelectionService} itemSelectionService - Service to manage item selection.
 * @param {UserService} userService - Service to manage user data.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method initializeUserData - Initializes user data by setting accounts, deposits, cards, and transactions.
 * @method setUserAccounts - Sets the user accounts.
 * @method setUserDeposits - Sets the user deposits.
 * @method setUserCards - Sets the user cards.
 * @method setUserTransactions - Sets the user transactions.
 * @method handleWidthChange - Handles the width change to adjust pagination.
 * @method changeTabName - Changes the current tab name.
 * @param {string} tabName - The new tab name to be set.
 * @method getDayAndMonthFromDate - Gets the day and month from a date string.
 * @param {string} date - The date string.
 * @returns {string} - Returns the formatted day and month string.
 * @method setSelectedAccount - Sets the selected account.
 * @param {Account} account - The account to be selected.
 * @method setSelectedCard - Sets the selected card.
 * @param {Card} card - The card to be selected.
 * @method getShortenedAccountNumber - Gets the shortened account number from a transaction.
 * @param {Transaction} transaction - The transaction object.
 * @returns {string} - Returns the shortened account number.
 * @method filterTransactions - Filters the transactions to include only today's and yesterday's transactions.
 * @method groupUserTransactions - Groups the user transactions by day.
 */
@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
  animations: [AnimationsProvider.animations],
})
export class FinancesComponent implements OnInit {
  public userCards!: Card[];
  public userDeposits!: Deposit[];
  public userAccounts!: Account[];
  public userTransactions!: Transaction[];
  public dailyTransactions: Transaction[][];
  public cardPaginationService: PaginationService;
  public accountsPaginationService: PaginationService;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    private itemSelectionService: ItemSelectionService,
    protected userService: UserService,
    public convertService: ConvertService
  ) {
    this.userCards = [];
    this.userDeposits = [];
    this.userTransactions = [];
    this.dailyTransactions = [[]];
    this.cardPaginationService = new PaginationService();
    this.accountsPaginationService = new PaginationService();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.accountsPaginationService.onResize(event);
    this.cardPaginationService.onResize(event);
  }

  public ngOnInit(): void {
    this.initializeUserData();
  }

  public initializeUserData(): void {
    this.setUserAccounts();
    this.setUserDeposits();
    this.setUserCards();
    this.setUserTransactions();
    this.handleWidthChange();
  }

  public setUserAccounts(): void {
    this.userService.userAccounts.subscribe((newAccountsArray: Account[]) => {
      if (newAccountsArray.length >= 1) {
        this.userAccounts = newAccountsArray;
        this.accountsPaginationService.setPaginatedArray(this.userAccounts);
        this.handleWidthChange();
      }
    });
  }

  public setUserDeposits(): void {
    this.userService.userDeposits.subscribe((newUserDeposits: Deposit[]) => {
      if (newUserDeposits.length >= 1) {
        this.userDeposits = newUserDeposits;
      }
    });
  }

  public setUserCards(): void {
    this.userService.userCards.subscribe((newUserCards: Card[]) => {
      if (newUserCards.length >= 1) {
        this.userCards = newUserCards;
        this.cardPaginationService.setPaginatedArray(this.userCards);
        this.cardPaginationService.setLargeBreakpointItemsPerPage(4);
        this.handleWidthChange();
      }
    });
  }

  public setUserTransactions(): void {
    this.userService.userTransactions.subscribe(
      (newUserTransactions: Transaction[]) => {
        if (newUserTransactions.length >= 1) {
          this.userTransactions = newUserTransactions;
          this.filterTransactions();
          this.groupUserTransactions();
        }
      }
    );
  }

  public handleWidthChange(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accountsPaginationService.handleWidthChange(window.innerWidth);
      this.cardPaginationService.handleWidthChange(window.innerWidth);
    }
  }

  public changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public getDayAndMonthFromDate(date: string): string {
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

  public setSelectedAccount(account: Account): void {
    this.itemSelectionService.setSelectedAccount(account);
  }

  public setSelectedCard(card: Card): void {
    this.itemSelectionService.setSelectedCard(card);
  }

  public getShortenedAccountNumber(transaction: Transaction): string {
    return typeof transaction.assignedAccountNumber === 'string'
      ? transaction.assignedAccountNumber.slice(31)
      : transaction.assignedAccountNumber.toString();
  }

  public filterTransactions(): void {
    this.userTransactions = this.userTransactions.filter(
      (transaction: Transaction) => {
        return (
          new Date().getDate() === new Date(transaction.date).getDate() ||
          new Date().getDate() - 1 === new Date(transaction.date).getDate()
        );
      }
    );
  }

  public groupUserTransactions(): void {
    this.dailyTransactions = this.convertService.getGroupedUserTransactions(
      this.userTransactions
    );
    this.dailyTransactions &&
      this.dailyTransactions.forEach((transactionArray: Transaction[]) => {
        transactionArray.splice(2);
      });
  }
}
