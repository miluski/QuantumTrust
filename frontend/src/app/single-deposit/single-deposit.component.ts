import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { Step } from '../../types/step';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { BOTTOM_INFORMATION, TOP_INFORMATION } from '../../utils/enums';
import { singleDepositStepsArray } from '../../utils/steps-objects-arrays';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ScrollArrowUpComponent } from '../scroll-arrow-up/scroll-arrow-up.component';

@Component({
  selector: 'app-single-deposit',
  templateUrl: './single-deposit.component.html',
  imports: [
    MatDividerModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    ScrollArrowUpComponent,
  ],
  standalone: true,
})
export class SingleDepositComponent implements OnInit {
  @Input() steps: Step[] = singleDepositStepsArray;
  protected depositObject!: Deposit;
  protected BOTTOM_INFORMATION: string = BOTTOM_INFORMATION;
  protected TOP_INFORMATION: string = TOP_INFORMATION;
  protected initialCapital: number = 100;
  protected interval: number = 1;
  protected profit: number = 0;
  protected depositType: string = 'timely';
  constructor(
    private productTypesService: ProductTypesService,
    public convertService: ConvertService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => {
        this.depositType = depositType;
        this.depositObject = this.getDepositObject();
        this.calculateProfit();
      }
    );
    this.depositObject = this.getDepositObject();
    this.calculateProfit();
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
    this.depositObject = this.getDepositObject();
  }
  calculateProfit(): void {
    const monthsCount: number = this.convertService.getMonths(this.interval);
    if (this.depositObject.type !== 'progressive') {
      this.profit = Math.round(
        ((this.initialCapital * this.depositObject.percent) / 100) *
          (monthsCount / 12)
      );
    } else {
      let rate = this.depositObject.percent;
      let totalProfit = 0;
      for (let i = 1; i <= monthsCount; i++) {
        if (i > 3) {
          rate += 1;
        }
        totalProfit += (this.initialCapital * rate) / 100 / 12;
      }
      this.profit = Math.round(totalProfit);
    }
    this.profit = Math.round(this.profit * 0.83);
  }
  private getDepositObject(): Deposit {
    return depositsObjectArray.find(
      (deposit: Deposit) => deposit.type === this.depositType
    ) as Deposit;
  }
}
