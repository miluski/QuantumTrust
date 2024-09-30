import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SingleAccountBalanceChartComponent } from './single-account-balance-chart.component';

describe('SingleAccountBalanceChartComponent', () => {
  let component: SingleAccountBalanceChartComponent;
  let fixture: ComponentFixture<SingleAccountBalanceChartComponent>;
  beforeEach(async () => {
    Chart.register(...registerables);
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BaseChartDirective,
        SingleAccountBalanceChartComponent,
      ],
      providers: [ChangeDetectorRef],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAccountBalanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set chart options on init', () => {
    component.ngOnInit();
    expect(component.chartOptions).toEqual({ responsive: true });
  });
  it('should set chart labels on init', () => {
    component.ngOnInit();
    expect(component.chartLabels).toEqual(['Wpływy', 'Wydatki']);
  });
  it('should set chart dataset on init', () => {
    component.totalIncomingBalance = 100;
    component.totalOutgoingBalance = 50;
    component.ngOnInit();
    expect(component.chartDataset).toEqual([
      {
        data: [100, 50],
        backgroundColor: ['green', 'red'],
      },
    ]);
  });
  it('should update chart dataset on changes', () => {
    component.totalIncomingBalance = 200;
    component.totalOutgoingBalance = 100;
    component.ngOnChanges();
    expect(component.chartDataset).toEqual([
      {
        data: [200, 100],
        backgroundColor: ['green', 'red'],
      },
    ]);
  });
});
