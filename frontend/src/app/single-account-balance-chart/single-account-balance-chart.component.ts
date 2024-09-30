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

/**
 * Component for displaying a pie chart of a single account's balance.
 * 
 * @selector app-single-account-balance-chart
 * @templateUrl ./single-account-balance-chart.component.html
 * @imports [CommonModule, BaseChartDirective]
 * @standalone true
 * 
 * @class SingleAccountBalanceChartComponent
 * @implements OnInit, OnChanges
 * 
 * @property {number} totalIncomingBalance - The total incoming balance for the account.
 * @property {number} totalOutgoingBalance - The total outgoing balance for the account.
 * @property {string | undefined} accountCurrency - The currency of the account.
 * @property {ChartOptions<'pie'>} chartOptions - The options for the pie chart.
 * @property {String[]} chartLabels - The labels for the pie chart.
 * @property {ChartDataset<'pie', Number[]>[]} chartDataset - The dataset for the pie chart.
 * 
 * @constructor
 * @param {ChangeDetectorRef} changeDetectorRef - Service to detect changes in the component.
 * 
 * @method ngOnInit - Lifecycle hook that is called after data-bound properties are initialized.
 * @method ngOnChanges - Lifecycle hook that is called when any data-bound property changes.
 * @method setChartOptions - Sets the options for the pie chart.
 * @method setChartLabels - Sets the labels for the pie chart.
 * @method setChartDataset - Sets the dataset for the pie chart.
 */
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
  public chartOptions!: ChartOptions<'pie'>;
  public chartLabels!: String[];
  public chartDataset!: ChartDataset<'pie', Number[]>[];
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
