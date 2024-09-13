import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeaderStateService } from '../../services/header-state.service';
import { ProductTypesService } from '../../services/product-types.service';
import { WindowEventsService } from '../../services/window-events.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatIconModule, RouterModule],
  standalone: true,
})
export class FooterComponent {
  accountType: string = 'personal';
  cardType: string = 'standard';
  depositType: string = 'timely';
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService,
    private headerStateService: HeaderStateService
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
    this.headerStateService.changeTabName(tabName);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
