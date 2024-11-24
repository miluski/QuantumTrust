import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Account } from '../../types/account';
import { Step } from '../../types/step';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { singleAccountStepsArray } from '../../utils/steps-objects-arrays';

/**
 * @component SingleAccountComponent
 * @description This component is responsible for displaying and managing a single account view.
 *
 * @selector app-single-account
 * @templateUrl ./single-account.component.html
 *
 * @class SingleAccountComponent
 * @implements OnInit
 *
 * @property {Step[]} steps - An array of steps for the single account view.
 * @property {string} accountType - The type of account, default is 'personal'.
 * @property {Account} accountObject - The account object containing account details.
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {PaginationService} paginationService - Service to manage pagination.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentAccountType observable.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method changeAccountType - Changes the account type using the productTypesService.
 * @param {string} accountType - The new account type to be set.
 * @method trackById - Tracks steps by their ID.
 * @param {Step} step - The step object.
 * @returns {number} - Returns the ID of the step.
 * @method setAccountsArray - Sets the accounts array for pagination.
 * @method getAccountObject - Gets the account object based on the account type.
 * @returns {Account} - Returns the account object.
 */
@Component({
  selector: 'app-single-account',
  templateUrl: './single-account.component.html',
})
export class SingleAccountComponent implements OnInit {
  @Input() steps: Step[];

  public accountType: string;
  public accountObject!: Account;

  constructor(
    private productTypesService: ProductTypesService,
    protected paginationService: PaginationService,
    public convertService: ConvertService
  ) {
    this.steps = singleAccountStepsArray;
    this.accountType = 'personal';
    this.setAccountsArray();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.paginationService.onResize(event);
  }

  public ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe(
      (accountType: string) => {
        this.accountType = accountType;
        this.setAccountsArray();
      }
    );
    this.accountObject = this.getAccountObject();
    this.setAccountsArray();
  }

  public changeAccountType(accountType: string): void {
    this.productTypesService.changeAccountType(accountType);
    this.setAccountsArray();
  }

  public trackById(step: Step): number {
    return step.id;
  }

  private setAccountsArray(): void {
    this.accountObject = this.getAccountObject();
    this.paginationService.setPaginatedArray(
      accountsObjectsArray.filter(
        (account: Account, _: number) => account.id !== this.accountObject.id
      )
    );
    this.paginationService.handleWidthChange(window.innerWidth);
  }

  private getAccountObject(): Account {
    return accountsObjectsArray.find(
      (account: Account) => account.type === this.accountType
    ) as Account;
  }
}
