import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-open-deposit',
  templateUrl: './open-deposit.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    VerificationCodeComponent,
    CommonModule,
    MatIconModule,
    FormsModule,
  ],
  standalone: true,
})
export class OpenDepositComponent implements OnInit {
  protected userAccounts!: Account[];
  protected deposit: Deposit = new Deposit();
  protected isAccountNumberValid: boolean = true;
  protected isInitialCapitalValid: boolean = true;
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  constructor(
    protected convertService: ConvertService,
    protected paginationService: PaginationService,
    protected verificationService: VerificationService,
    protected userService: UserService
  ) {
    this.paginationService.paginationMethod = 'movableItems';
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }
  ngOnInit(): void {
    this.paginationService.setPaginatedArray(depositsObjectArray);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
    this.setUserAccounts();
  }
  async setUserAccounts(): Promise<void> {
    this.userAccounts = await this.userService.getUserAccountsArray();
    this.deposit.assignedAccountNumber = this.userAccounts[0].id;
  }
  setDepositEndDate(): void {
    const date: Date = new Date();
    const actualMonth: number = date.getUTCMonth();
    const monthCount: number = this.convertService.getMonths(
      this.deposit.duration as number
    );
    date.setUTCMonth(actualMonth + monthCount);
    this.deposit.endDate = date.toISOString().split('T')[0];
  }
  setDepositAccountNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.isAccountNumberValid =
        this.verificationService.validateSelectedAccount(
          this.userAccounts,
          target.value
        );
      this.deposit.assignedAccountNumber = this.isAccountNumberValid
        ? target.value
        : this.deposit.assignedAccountNumber;
    }
  }
  getValueWithCurrency(multiplier: number): string {
    return this.getLimit(multiplier) + ' ' + this.currentCurrency;
  }
  getLimit(multiplier: number): number {
    const limit: number = this.convertService.getCalculatedAmount(
      this.currentCurrency,
      multiplier
    );
    this.deposit.balance = multiplier === 100 ? limit : this.deposit.balance;
    return limit;
  }
  handleButtonClick(): void {
    const isSomeDataInvalid: boolean =
      !this.isAccountNumberValid || !this.isInitialCapitalValid;
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
  }
  get monthsDescription(): string {
    const monthsCount: number = this.convertService.getMonths(
      this.deposit.duration as number
    );
    const monthsForm: string = this.convertService.getMonthForm(
      this.deposit.duration as number
    );
    return monthsCount.toString() + ' ' + monthsForm;
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
  getIsInitialCapitalValid(initialCapitalInput: NgModel): boolean {
    this.isInitialCapitalValid =
      !this.verificationService.validateInput(initialCapitalInput);
    return this.isInitialCapitalValid;
  }
  private getActualAccount(): Account | undefined {
    return (
      this.userAccounts &&
      this.userAccounts.find(
        (account: Account) => account.id === this.deposit.assignedAccountNumber
      )
    );
  }
}
