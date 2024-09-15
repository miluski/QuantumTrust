import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAccountBalanceChartComponent } from './single-account-balance-chart.component';

describe('SingleAccountBalanceChartComponent', () => {
  let component: SingleAccountBalanceChartComponent;
  let fixture: ComponentFixture<SingleAccountBalanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleAccountBalanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAccountBalanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
