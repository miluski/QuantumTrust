import { Component } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';
import { UserService } from '../../services/user.service';

/**
 * @component FooterComponent
 * @description This component is responsible for displaying and managing the footer section of the application.
 *
 * @selector app-footer
 * @templateUrl ./footer.component.html
 *
 * @class FooterComponent
 *
 * @property {string} cardType - The type of card, default is 'standard'.
 * @property {string} depositType - The type of deposit, default is 'timely'.
 * @property {string} accountType - The type of account, default is 'personal'.
 * @property {string} currentTabName - The name of the current tab.
 * @property {number} currentTransactionsArrayLength - The length of the current transactions array.
 *
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentAccountType, currentCardType, currentDepositType, currentTabName, and currentTransactionsArrayLength observables.
 * @method changeAccountType - Changes the account type using the productTypesService.
 * @param {string} accountType - The new account type to be set.
 * @method changeCardType - Changes the card type using the productTypesService.
 * @param {string} cardType - The new card type to be set.
 * @method changeDepositType - Changes the deposit type using the productTypesService.
 * @param {string} depositType - The new deposit type to be set.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method canBeSticky - Determines if the footer can be sticky based on the current tab name and transactions array length.
 * @returns {boolean} - Returns true if the footer can be sticky, otherwise false.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public cardType: string;
  public depositType: string;
  public accountType: string;
  public currentTabName!: string;
  public currentTransactionsArrayLength!: number;

  constructor(
    private userService: UserService,
    private productTypesService: ProductTypesService,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.cardType = 'standard';
    this.depositType = 'timely';
    this.accountType = 'personal';
  }

  public ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe(
      (accountType: string) => (this.accountType = accountType)
    );
    this.productTypesService.currentCardType.subscribe(
      (cardType: string) => (this.cardType = cardType)
    );
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => (this.depositType = depositType)
    );
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.currentTabName = tabName)
    );
    this.appInformationStatesService.currentTransactionsArrayLength.subscribe(
      (arrayLength: number) =>
        (this.currentTransactionsArrayLength = arrayLength)
    );
  }

  public changeAccountType(accountType: string): void {
    this.userService.logout();
    this.productTypesService.changeAccountType(accountType);
  }

  public changeCardType(cardType: string): void {
    this.userService.logout();
    this.productTypesService.changeCardType(cardType);
  }

  public changeDepositType(depositType: string): void {
    this.userService.logout();
    this.productTypesService.changeDepositType(depositType);
  }

  public changeTabName(tabName: string): void {
    this.userService.logout();
    this.appInformationStatesService.changeTabName(tabName);
  }
  
  get canBeSticky(): boolean {
    return (
      this.currentTransactionsArrayLength > 20 &&
      (this.currentTabName === 'SingleAccountTransactions' ||
        this.currentTabName === 'ChangeCardSettings')
    );
  }
}
