import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
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
export class FinancesComponent implements OnInit {
  userAccount: UserAccount;
  userAccounts!: Account[];
  userDeposits!: Deposit[];
  userTransactions!: Transaction[];
  userCards!: Card[];
  dailyTransactions: Transaction[][] = [[]];
  accountsPaginationService: PaginationService = new PaginationService();
  cardPaginationService: PaginationService = new PaginationService();
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
    this.dailyTransactions.forEach((transactionArray: Transaction[]) =>
      transactionArray.splice(2)
    );
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
  private filterTransactions(): void {
    this.userTransactions = this.userTransactions.filter(
      (transaction: Transaction) =>
        new Date().getDate() === new Date(transaction.date).getDate() ||
        new Date().getDate() - 1 === new Date(transaction.date).getDate()
    );
  }
}
