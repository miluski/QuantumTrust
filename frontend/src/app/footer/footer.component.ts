import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';

/**
 * @fileoverview FooterComponent is a standalone Angular component that manages the footer section of the application.
 * It interacts with ProductTypesService and AppInformationStatesService to update and reflect the current state of 
 * account type, card type, deposit type, and tab name.
 * 
 * @component
 * @selector app-footer
 * @templateUrl ./footer.component.html
 * @imports [MatIconModule, RouterModule, CommonModule]
 * 
 * @class
 * @classdesc The FooterComponent class initializes with default values for account type, card type, and deposit type.
 * It subscribes to various observables to keep track of the current state and provides methods to change these states.
 * It also includes a computed property to determine if the footer can be sticky based on the current tab name and 
 * transactions array length.
 * 
 * @property {string} accountType - The current account type, default is 'personal'.
 * @property {string} cardType - The current card type, default is 'standard'.
 * @property {string} depositType - The current deposit type, default is 'timely'.
 * @property {string} currentTabName - The name of the current tab.
 * @property {number} currentTransactionsArrayLength - The length of the current transactions array.
 * 
 * @method ngOnInit - Lifecycle hook that subscribes to observables from ProductTypesService and AppInformationStatesService.
 * @method changeAccountType - Changes the current account type.
 * @method changeCardType - Changes the current card type.
 * @method changeDepositType - Changes the current deposit type.
 * @method changeTabName - Changes the current tab name.
 * @method canBeSticky - Computed property that determines if the footer can be sticky based on the current tab name and transactions array length.
 * 
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatIconModule, RouterModule, CommonModule],
  standalone: true,
})
export class FooterComponent {
  public accountType: string = 'personal';
  public cardType: string = 'standard';
  public depositType: string = 'timely';
  public currentTabName!: string;
  public currentTransactionsArrayLength!: number;
  constructor(
    private productTypesService: ProductTypesService,
    private appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
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
  changeAccountType(accountType: string): void {
    this.productTypesService.changeAccountType(accountType);
  }
  changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
  }
  changeTabName(tabName: string): void {
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
