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

/**
 * @component OpenDepositComponent
 * @description This component is responsible for managing the process of opening a new deposit for users.
 *
 * @selector app-open-deposit
 * @templateUrl ./open-deposit.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class OpenDepositComponent
 * @implements OnInit
 *
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {Deposit} deposit - The deposit object containing deposit details.
 * @property {boolean} isAccountNumberValid - Flag indicating if the account number is valid.
 * @property {boolean} isInitialCapitalValid - Flag indicating if the initial capital is valid.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {ConvertService} convertService - Service to handle data conversion.
 * @param {PaginationService} paginationService - Service to manage pagination.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {UserService} userService - Service to manage user data.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method setUserAccounts - Sets the user accounts.
 * @method setDepositEndDate - Sets the end date of the deposit based on its duration.
 * @method setDepositAccountNumber - Sets the account number for the deposit.
 * @param {Event} event - The event object.
 * @method getValueWithCurrency - Gets the value with the currency symbol.
 * @param {number} multiplier - The multiplier for the value.
 * @returns {string} - Returns the value with the currency symbol.
 * @method getLimit - Gets the limit based on the currency and multiplier.
 * @param {number} multiplier - The multiplier for the limit.
 * @returns {number} - Returns the calculated limit.
 * @method handleButtonClick - Handles the button click event to validate fields and set the shake state.
 * @method getIsInitialCapitalValid - Checks if the initial capital is valid.
 * @param {NgModel} initialCapitalInput - The initial capital input model.
 * @returns {boolean} - Returns true if the initial capital is valid, otherwise false.
 * @method monthsDescription - Getter method to get the description of the deposit duration in months.
 * @returns {string} - Returns the description of the deposit duration in months.
 * @method currentCurrency - Getter method to get the current currency of the selected account.
 * @returns {string} - Returns the current currency of the selected account.
 * @method currentSelectedDepositType - Getter method to get the type of the currently selected deposit.
 * @returns {string} - Returns the type of the currently selected deposit.
 * @method getActualAccount - Gets the actual account based on the assigned account number.
 * @returns {Account | undefined} - Returns the actual account or undefined if not found.
 */
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
    }
  }

  public getValueWithCurrency(multiplier: number): string {
    return this.getLimit(multiplier) + ' ' + this.currentCurrency;
  }

  public getLimit(multiplier: number): number {
    const limit: number = this.convertService.getCalculatedAmount(
      this.currentCurrency,
      multiplier
    );
    this.deposit.balance = multiplier === 100 ? limit : this.deposit.balance;
    return limit;
  }

  public handleButtonClick(): void {
    const isSomeDataInvalid: boolean =
      !this.isAccountNumberValid || !this.isInitialCapitalValid;
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }

  public getIsInitialCapitalValid(initialCapitalInput: NgModel): boolean {
    this.isInitialCapitalValid =
      !this.verificationService.validateInput(initialCapitalInput);
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

  public get currentCurrency(): string {
    const actualAccount: Account | undefined = this.getActualAccount();
    return actualAccount ? actualAccount.currency ?? 'PLN' : 'PLN';
  }

  public get currentSelectedDepositType(): string {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1].type
      : this.paginationService.paginatedItems[0].type;
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
