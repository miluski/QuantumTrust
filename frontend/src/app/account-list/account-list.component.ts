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
 * It uses Angular's standalone component feature and imports necessary modules.
 *
 * @selector app-account-list
 * @templateUrl ./account-list.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class AccountListComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} accountType - The type of account, default is 'personal'.
 * @property {number} currentIndex - The current index in the accounts array.
 * @property {Account[]} accountsObjectsArray - An array of account objects.
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a browser.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ProductTypesService} productTypeService - Service to manage product types.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentAccountType and currentTabName observables.
 * @method changeAccountType - Changes the account type using the productTypeService.
 * @param {string} accountType - The new account type to be set.
 * @method isAccountIdEven - Checks if the account ID is even.
 * @param {string} accountId - The ID of the account to be checked.
 * @returns {boolean} - Returns true if the account ID is even, otherwise false.
 */
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  animations: [AnimationsProvider.animations],
})
export class AccountListComponent implements OnInit {
  public tabName: string;
  public accountType: string;
  public currentIndex: number;
  public accountsObjectsArray: Account[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    private productTypeService: ProductTypesService
  ) {
    this.tabName = 'Konta';
    this.accountType = 'personal';
    this.currentIndex = 0;
    this.accountsObjectsArray = accountsObjectsArray;
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productTypeService.currentAccountType.subscribe(
        (accountType: string) => (this.accountType = accountType)
      );
      this.appInformationStatesService.currentTabName.subscribe(
        (tabName: string) => (this.tabName = tabName)
      );
    }
  }

  public changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }

  public isAccountIdEven(accountId: string): boolean {
    return Number(accountId) % 2 === 0;
  }
}