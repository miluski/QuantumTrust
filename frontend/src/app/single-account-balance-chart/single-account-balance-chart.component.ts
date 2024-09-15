import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-single-account-balance-chart',
  templateUrl: './single-account-balance-chart.component.html',
  imports: [CommonModule, BaseChartDirective],
  standalone: true,
})
export class SingleAccountBalanceChartComponent implements OnInit, OnChanges {
  @Input() totalIncomingBalance!: number;
  @Input() totalOutgoingBalance!: number;
  @Input() accountCurrency!: string | undefined;
  protected chartOptions!: ChartOptions<'pie'>;
  protected chartLabels!: String[];
  protected chartDataset!: ChartDataset<'pie', Number[]>[];
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.setChartOptions();
    this.setChartLabels();
    this.setChartDataset();
    this.changeDetectorRef.detectChanges();
  }
  ngOnChanges(): void {
    this.setChartDataset();
  }
  private setChartOptions(): void {
    this.chartOptions = {
      responsive: true,
    };
  }
  private setChartLabels(): void {
    this.chartLabels = ['Wpływy', 'Wydatki'];
  }
  private setChartDataset(): void {
    this.chartDataset = [
      {
        data: [this.totalIncomingBalance, this.totalOutgoingBalance],
        backgroundColor: ['green', 'red'],
      },
    ];
  }
}
