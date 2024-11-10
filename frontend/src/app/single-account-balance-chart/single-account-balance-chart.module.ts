import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { SingleAccountBalanceChartComponent } from './single-account-balance-chart.component';

@NgModule({
  declarations: [SingleAccountBalanceChartComponent],
  imports: [CommonModule, BaseChartDirective],
  exports: [SingleAccountBalanceChartComponent],
})
export class SingleAccountBalanceChartModule {}
