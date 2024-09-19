import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { BOTTOM_INFORMATION } from '../../utils/enums';

@Component({
  selector: 'app-open-deposit',
  templateUrl: './open-deposit.component.html',
  imports: [CommonModule, MatIconModule, FormsModule],
  standalone: true,
})
export class OpenDepositComponent implements OnInit {
  protected userAccounts!: Account[];
  protected currentSelectedAccountId!: string;
  protected depositDuration: number = 1;
  protected accountId!: string;
  protected startCapital: number = 100;
  protected BOTTOM_INFORMATION: string = BOTTOM_INFORMATION;
  constructor(
    protected convertService: ConvertService,
    protected paginationService: PaginationService,
    protected userService: UserService
  ) {
    this.paginationService.paginationMethod = 'movableItems';
  }
  ngOnInit(): void {
    this.paginationService.setPaginatedArray(depositsObjectArray);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
    this.setUserAccounts();
  }
  async setUserAccounts(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.currentSelectedAccountId = this.userAccounts[0].id;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }
  get monthsDescription(): string {
    const monthsCount: number = this.convertService.getMonths(
      this.depositDuration
    );
    const monthsForm: string = this.convertService.getMonthForm(
      this.depositDuration
    );
    return monthsCount.toString() + ' ' + monthsForm;
  }
  getValueWithCurrency(multiplier: number): string {
    return this.getLimit(multiplier) + ' ' + this.accountCurrency;
  }
  getLimit(multiplier: number): number {
    const limit: number = this.convertService.getCalculatedAmount(
      this.accountCurrency,
      multiplier
    );
    this.startCapital = multiplier === 100 ? limit : this.startCapital;
    return limit;
  }
  get currentCurrency(): string {
    const actualAccount: Account | undefined = this.getActualAccount();
    return actualAccount ? actualAccount.currency ?? 'PLN' : 'PLN';
  }
  get currentSelectedDepositType(): string {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1].type
      : this.paginationService.paginatedItems[0].type;
  }
  get accountCurrency(): string {
    const actualAccount: Account | undefined = this.getActualAccount();
    return actualAccount ? actualAccount.currency ?? 'PLN' : 'PLN';
  }
  private getActualAccount(): Account | undefined {
    return this.userAccounts.find(
      (account: Account) => account.id === this.currentSelectedAccountId
    );
  }
}
