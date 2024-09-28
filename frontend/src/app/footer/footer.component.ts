import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatIconModule, RouterModule, CommonModule],
  standalone: true,
})
export class FooterComponent {
  protected accountType: string = 'personal';
  protected cardType: string = 'standard';
  protected depositType: string = 'timely';
  protected currentTabName!: string;
  protected currentTransactionsArrayLength!: number;
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
