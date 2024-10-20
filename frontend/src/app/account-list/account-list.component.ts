import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Account } from '../../types/account';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';

/**
 * @component AccountListComponent
 * @description This component is responsible for displaying a list of accounts.
 * It uses Angular's standalone component feature and includes animations.
 *
 * @selector app-account-list
 * @templateUrl ./account-list.component.html
 * @animations [AnimationsProvider.animations]
 *
 *
 * @property {string} accountType - The type of account, default is 'personal'.
 * @property {Account[]} accountsObjectsArray - An array of account objects.
 * @property {number} currentIndex - The current index in the account list.
 *
 * @constructor
 * @param {ProductTypesService} productTypeService - Service to manage product types.
 *
 * @method ngOnInit
 * @description Initializes the component and subscribes to the currentAccountType observable.
 *
 * @method changeAccountType
 * @param {string} accountType - The new account type to be set.
 * @description Changes the account type using the ProductTypesService.
 *
 * @method isAccountIdEven
 * @param {string} accountId - The account ID to check.
 * @returns {boolean} - Returns true if the account ID is even, false otherwise.
 * @description Checks if the given account ID is an even number.
 */
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  animations: [AnimationsProvider.animations],
})
export class AccountListComponent implements OnInit {
  public tabName: string = 'Konta';
  public accountType: string = 'personal';
  public accountsObjectsArray: Account[] = accountsObjectsArray;
  public currentIndex: number = 0;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    private productTypeService: ProductTypesService
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productTypeService.currentAccountType.subscribe(
        (accountType: string) => (this.accountType = accountType)
      );
      this.appInformationStatesService.currentTabName.subscribe(
        (tabName: string) => (this.tabName = tabName)
      );
    }
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
  isAccountIdEven(accountId: string): boolean {
    return Number(accountId) % 2 === 0;
  }
}
