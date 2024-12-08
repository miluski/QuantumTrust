import { Component, HostListener, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { Currency } from '../../types/currency';

@Component({
  selector: 'app-open-deposit',
  templateUrl: './open-deposit.component.html',
  animations: [AnimationsProvider.animations],
})
export class OpenDepositComponent implements OnInit {
  protected userAccounts!: Account[];

  public deposit: Deposit;
  public isAccountNumberValid: boolean;
  public isInitialCapitalValid: boolean;
  public shakeStateService: ShakeStateService;

  constructor(
    protected convertService: ConvertService,
    protected paginationService: PaginationService,
    protected verificationService: VerificationService,
    protected userService: UserService
  ) {
    this.deposit = new Deposit();
    this.setDepositEndDate();
    this.isAccountNumberValid = true;
    this.isInitialCapitalValid = true;
    this.shakeStateService = new ShakeStateService();
    this.paginationService.paginationMethod = 'movableItems';
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }

  public ngOnInit(): void {
    this.paginationService.setPaginatedArray(depositsObjectArray);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
    this.setUserAccounts();
    this.deposit.balance = this.getLimit(100);
  }

  public setUserAccounts(): void {
    this.userService.userAccounts.subscribe((newAccountsArray: Account[]) => {
      if (newAccountsArray.length >= 1) {
        this.userAccounts = newAccountsArray;
        this.deposit.assignedAccountNumber = this.userAccounts[0].id;
      }
    });
  }

  public setDepositEndDate(): void {
    const date: Date = new Date();
    const actualMonth: number = date.getUTCMonth();
    const monthCount: number = this.convertService.getMonths(
      this.deposit.duration as number
    );
    date.setUTCMonth(actualMonth + monthCount);
    this.deposit.endDate = date.toISOString().split('T')[0];
  }

  public setDepositAccountNumber(event: Event) {
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
      this.deposit.balance = this.getLimit(100);
    }
  }

  public getValueWithCurrency(multiplier: number): string {
    return this.getLimit(multiplier) + ' ' + this.currentCurrency;
  }

  public getLimit(multiplier: number): number {
    const limit: number = this.convertService.getCalculatedAmount(
      "PLN",
      this.currentCurrency,
      multiplier
    );
    return limit;
  }

  public handleButtonClick(): void {
    const isSomeDataInvalid: boolean =
      !this.isAccountNumberValid || !this.isInitialCapitalValid;
    if (isSomeDataInvalid === false) {
      this.deposit.type = this.currentSelectedDepositType;
      this.deposit.currency = this.currentCurrency;
      this.deposit.percent = Number(this.currentSelectedDepositPercent);
      this.userService.operation = 'open-deposit';
      this.userService.setOpeningDeposit(this.deposit);
      this.userService.sendVerificationEmail('otworzenie nowej lokaty');
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }

  public getIsInitialCapitalValid(initialCapitalInput: NgModel): boolean {
    this.isInitialCapitalValid =
      !this.verificationService.validateInput(initialCapitalInput) &&
      initialCapitalInput.value <= (this.getActualAccount()?.balance ?? -1);
    return this.isInitialCapitalValid;
  }

  public get monthsDescription(): string {
    const monthsCount: number = this.convertService.getMonths(
      this.deposit.duration as number
    );
    const monthsForm: string = this.convertService.getMonthForm(
      this.deposit.duration as number
    );
    return monthsCount && monthsForm
      ? monthsCount.toString() + ' ' + monthsForm
      : '';
  }

  public get currentCurrency(): Currency {
    const actualAccount: Account | undefined = this.getActualAccount();
    return actualAccount ? actualAccount.currency ?? 'PLN' : 'PLN';
  }

  public get currentSelectedDepositType(): string {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1].type
      : this.paginationService.paginatedItems[0].type;
  }

  public get currentSelectedDepositPercent(): string {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1].percent
      : this.paginationService.paginatedItems[0].percent;
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
