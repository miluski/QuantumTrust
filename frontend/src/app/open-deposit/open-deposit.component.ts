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

/**
 * @component OpenDepositComponent
 * @description This component handles the opening of a deposit account. It includes functionalities for setting user accounts, validating account numbers and initial capital, and handling pagination and UI interactions.
 * 
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {Deposit} deposit - The deposit object being managed.
 * @property {boolean} isAccountNumberValid - Flag indicating if the account number is valid.
 * @property {boolean} isInitialCapitalValid - Flag indicating if the initial capital is valid.
 * @property {ShakeStateService} shakeStateService - Service to manage shake state.
 * 
 * @constructor
 * @param {ConvertService} convertService - Service for conversion operations.
 * @param {PaginationService} paginationService - Service for pagination operations.
 * @param {VerificationService} verificationService - Service for verification operations.
 * @param {UserService} userService - Service for user operations.
 * 
 * @method onResize - Handles window resize events.
 * @param {UIEvent} event - The resize event.
 * 
 * @method ngOnInit - Lifecycle hook that is called after data-bound properties are initialized.
 * 
 * @method setUserAccounts - Asynchronously sets the user accounts.
 * 
 * @method setDepositEndDate - Sets the end date for the deposit based on its duration.
 * 
 * @method setDepositAccountNumber - Sets the deposit account number based on user input.
 * @param {Event} event - The input event.
 * 
 * @method getValueWithCurrency - Returns a value with the current currency.
 * @param {number} multiplier - The multiplier for the value.
 * @returns {string} - The value with the currency.
 * 
 * @method getLimit - Calculates the limit based on the multiplier.
 * @param {number} multiplier - The multiplier for the limit.
 * @returns {number} - The calculated limit.
 * 
 * @method handleButtonClick - Handles the button click event and sets the shake state.
 * 
 * @getter monthsDescription - Returns a description of the deposit duration in months.
 * @returns {string} - The description of the deposit duration.
 * 
 * @getter currentCurrency - Returns the current currency of the actual account.
 * @returns {string} - The current currency.
 * 
 * @getter currentSelectedDepositType - Returns the type of the currently selected deposit.
 * @returns {string} - The type of the currently selected deposit.
 * 
 * @method getIsInitialCapitalValid - Validates the initial capital input.
 * @param {NgModel} initialCapitalInput - The initial capital input model.
 * @returns {boolean} - Whether the initial capital is valid.
 * 
 * @method getActualAccount - Returns the actual account based on the assigned account number.
 * @returns {Account | undefined} - The actual account or undefined if not found.
 */
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
  public userAccounts!: Account[];
  public deposit: Deposit = new Deposit();
  public isAccountNumberValid: boolean = true;
  public isInitialCapitalValid: boolean = true;
  public shakeStateService: ShakeStateService = new ShakeStateService();
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
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid ? 'shake' : 'none');
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
