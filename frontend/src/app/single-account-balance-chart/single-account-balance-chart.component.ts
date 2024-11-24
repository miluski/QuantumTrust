import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';

/**
 * @component SingleAccountBalanceChartComponent
 * @description This component is responsible for displaying a pie chart of the account's balance, showing total incoming and outgoing balances.
 *
 * @selector app-single-account-balance-chart
 * @templateUrl ./single-account-balance-chart.component.html
 *
 * @class SingleAccountBalanceChartComponent
 * @implements OnInit, OnChanges
 *
 * @property {number} totalIncomingBalance - The total incoming balance for the account.
 * @property {number} totalOutgoingBalance - The total outgoing balance for the account.
 * @property {string | undefined} accountCurrency - The currency of the account.
 *
 * @constructor
 * @param {ChangeDetectorRef} changeDetectorRef - Service to detect changes.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Sets the chart options, labels, and dataset.
 * @method ngOnChanges - Lifecycle hook that is called when any data-bound property of a directive changes. Updates the chart dataset.
 * @method setChartOptions - Sets the options for the chart.
 * @method setChartLabels - Sets the labels for the chart.
 * @method setChartDataset - Sets the dataset for the chart.
 */
@Component({
  selector: 'app-single-account-balance-chart',
  templateUrl: './single-account-balance-chart.component.html',
})
export class SingleAccountBalanceChartComponent implements OnInit, OnChanges {
  @Input() totalIncomingBalance!: number;
  @Input() totalOutgoingBalance!: number;
  @Input() accountCurrency!: string | undefined;

  public chartLabels!: String[];
  public chartOptions!: ChartOptions<'pie'>;
  public chartDataset!: ChartDataset<'pie', Number[]>[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.setChartOptions();
    this.setChartLabels();
    this.setChartDataset();
    this.changeDetectorRef.detectChanges();
  }

  public ngOnChanges(): void {
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
