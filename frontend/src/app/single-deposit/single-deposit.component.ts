import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { Deposit } from '../../types/deposit';
import { Step } from '../../types/step';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { BOTTOM_INFORMATION, TOP_INFORMATION } from '../../utils/enums';
import { singleDepositStepsArray } from '../../utils/steps-objects-arrays';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-single-deposit',
  templateUrl: './single-deposit.component.html',
  styleUrl: './single-deposit.component.css',
  imports: [
    MatDividerModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  standalone: true,
})
export class SingleDepositComponent implements OnInit {
  @Input() steps: Step[] = singleDepositStepsArray;
  depositObject!: Deposit;
  BOTTOM_INFORMATION: string = BOTTOM_INFORMATION;
  TOP_INFORMATION: string = TOP_INFORMATION;
  initialCapital: number = 100;
  interval: number = 1;
  profit: number = 0;
  private depositType: string = 'timely';
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe((depositType) => {
      this.depositType = depositType;
      this.depositObject = this.getDepositObject();
      this.calculateProfit();
    });
    this.depositObject = this.getDepositObject();
    this.calculateProfit();
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
    this.depositObject = this.getDepositObject();
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
    this.depositObject = this.getDepositObject();
  }
  calculateProfit() {
    if (this.depositObject.type !== 'progressive') {
      this.profit = Math.round(
        ((this.initialCapital * this.depositObject.percent) / 100) *
          (this.getMonths() / 12)
      );
    } else {
      let rate = this.depositObject.percent;
      let totalProfit = 0;
      for (let i = 1; i <= this.getMonths(); i++) {
        if (i > 3) {
          rate += 1;
        }
        totalProfit += (this.initialCapital * rate) / 100 / 12;
      }
      this.profit = Math.round(totalProfit);
    }
    this.profit = Math.round(this.profit * 0.83);
  }
  getPolishDepositType(usageType: string): string {
    switch (this.depositType) {
      case 'timely':
        return usageType === BOTTOM_INFORMATION ? 'terminową' : 'terminowa';
      case 'mobile':
        return usageType === BOTTOM_INFORMATION ? 'mobilną' : 'mobilna';
      case 'family':
        return usageType === BOTTOM_INFORMATION ? 'rodzinną' : 'rodzinna';
      case 'progressive':
        return usageType === BOTTOM_INFORMATION ? 'progresywną' : 'progresywna';
      default:
        return usageType === BOTTOM_INFORMATION ? 'terminową' : 'terminowa';
    }
  }
  private getMonths(): number {
    switch (this.interval) {
      case 2:
        return 3;
      case 3:
        return 6;
      case 4:
        return 12;
      default:
        return 1;
    }
  }
  private getDepositObject(): Deposit {
    return depositsObjectArray.find(
      (deposit: Deposit) => deposit.type === this.depositType
    ) as Deposit;
  }
}
