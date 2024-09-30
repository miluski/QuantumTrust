import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
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
 * @imports [CommonModule, RouterModule]
 * 
 * @input
 * @property {string} tabName - The name of the tab, default is 'Konta'.
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
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class AccountListComponent implements OnInit {
  @Input() tabName: string = 'Konta';
  public accountType: string = 'personal';
  public accountsObjectsArray: Account[] = accountsObjectsArray;
  public currentIndex: number = 0;
  constructor(private productTypeService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypeService.currentAccountType.subscribe(
      (accountType: string) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
  isAccountIdEven(accountId: string): boolean {
    return Number(accountId) % 2 === 0;
  }
}
