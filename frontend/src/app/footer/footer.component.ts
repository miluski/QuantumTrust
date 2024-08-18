import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  imports: [MatIconModule, RouterModule],
  standalone: true,
})
export class FooterComponent {
  private accountType: string = 'personal';
  private cardType: string = 'standard';
  private depositType: string = 'timely';
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe(
      (accountType) => (this.accountType = accountType)
    );
    this.productTypesService.currentCardType.subscribe(
      (cardType) => (this.cardType = cardType)
    );
    this.productTypesService.currentDepositType.subscribe(
      (depositType) => (this.depositType = depositType)
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
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
