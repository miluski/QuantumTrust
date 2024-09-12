import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
import { HeaderStateService } from '../../services/header-state.service';
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
  imports: [CommonModule, RouterModule, MatIconModule, CardIdFormatPipe],
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
export class FinancesComponent implements AfterContentChecked, OnInit {
  userAccount: UserAccount;
  userAccounts!: Account[];
  userDeposits!: Deposit[];
  userTransactions!: Transaction[];
  userCards!: Card[];
  dailyTransactions!: Transaction[][];
  itemsPerPage: number = 3;
  currentAccountsPage: number = 1;
  currentCardsPage: number = 1;
  totalAccountsPagesCount: number = 1;
  totalCardsPagesCount: number = 1;
  constructor(
    private headerStateService: HeaderStateService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.userAccount = userService.userAccount;
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit(): void {
    this.initializeUserData();
  }
  async initializeUserData(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.userDeposits = await this.userService.getUserDepositsArray();
    this.userTransactions = await this.userService.getUserTransactionsArray();
    this.userCards = await this.userService.getUserCardsArray();
    this.setItemsPerPage(window.innerWidth);
    this.updatePagesCount();
    this.filterTransactions();
    this.groupUserTransactions();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setItemsPerPage(event.target.innerWidth);
    this.updatePagesCount();
  }
  get paginatedUserAccounts(): Account[] {
    const startIndex = (this.currentAccountsPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.userAccounts.slice(startIndex, endIndex);
  }
  get paginatedUserCards(): Card[] {
    const startIndex = (this.currentCardsPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.userCards.slice(startIndex, endIndex);
  }
  groupUserTransactions(): void {
    const dailyTransactionsMap: Map<String, Transaction[]> = new Map<
      String,
      Transaction[]
    >();
    this.userTransactions.forEach((transaction: Transaction) => {
      const actualTransactionDate = transaction.date;
      dailyTransactionsMap.has(actualTransactionDate)
        ? dailyTransactionsMap.get(actualTransactionDate)?.push(transaction)
        : dailyTransactionsMap.set(actualTransactionDate, [transaction]);
    });
    this.dailyTransactions = Array.from(dailyTransactionsMap.values()).sort();
    this.dailyTransactions.forEach((transactionArray: Transaction[]) =>
      transactionArray.splice(2)
    );
  }
  setItemsPerPage(windowWidth: number): void {
    if (windowWidth < 1024) {
      this.itemsPerPage = 1;
    } else if (windowWidth > 1400) {
      this.itemsPerPage = 3;
    } else {
      this.itemsPerPage = 2;
    }
  }
  nextAccountsPage(): void {
    if (this.currentAccountsPage < this.totalAccountsPagesCount) {
      this.currentAccountsPage++;
    }
  }
  previousAccountsPage(): void {
    if (this.currentAccountsPage > 1) {
      this.currentAccountsPage--;
    }
  }
  nextCardsPage(): void {
    if (this.currentCardsPage < this.totalCardsPagesCount) {
      this.currentCardsPage++;
    }
  }
  previousCardsPage(): void {
    if (this.currentCardsPage > 1) {
      this.currentCardsPage--;
    }
  }
  changeTabName(tabName: string): void {
    this.headerStateService.changeTabName(tabName);
  }
  getPolishAccountType(accountType: string): string {
    switch (accountType) {
      case 'multiCurrency':
        return 'wielowalutowe';
      case 'young':
        return 'dla młodych';
      case 'family':
        return 'rodzinne';
      case 'oldPeople':
        return 'senior';
      default:
        return 'osobiste';
    }
  }
  getPolishDepositType(depositType: string): string {
    switch (depositType) {
      case 'timely':
        return 'terminowa';
      case 'mobile':
        return 'mobilna';
      case 'family':
        return 'rodzinna';
      default:
        return 'progresywna';
    }
  }
  getNumberWithSpacesBetweenThousands(number: number): string {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
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
  getIconClassFromTransactionCategory(transactionCategory: string): string {
    switch (transactionCategory) {
      case 'Artykuły spożywcze':
        return 'fa-cart-shopping';
      case 'Rachunki':
        return 'fa-money-bill';
      case 'Rozrywka':
        return 'fa-film ';
      default:
        return 'fa-question';
    }
  }
  private updatePagesCount(): void {
    this.totalAccountsPagesCount = Math.ceil(
      this.userAccounts.length / this.itemsPerPage
    );
    this.totalCardsPagesCount = Math.ceil(
      this.userCards.length / this.itemsPerPage
    );
    if (this.currentAccountsPage > this.totalAccountsPagesCount) {
      this.currentAccountsPage = 1;
    }
    if (this.currentCardsPage > this.totalCardsPagesCount) {
      this.currentCardsPage = 1;
    }
  }
  private filterTransactions(): void {
    this.userTransactions = this.userTransactions.filter(
      (transaction: Transaction) =>
        new Date().getDate() === new Date(transaction.date).getDate() ||
        new Date().getDate() - 1 === new Date(transaction.date).getDate()
    );
  }
}
