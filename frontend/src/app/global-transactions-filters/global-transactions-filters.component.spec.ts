import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTransactionsFiltersComponent } from './global-transactions-filters.component';

describe('GlobalTransactionsFiltersComponent', () => {
  let component: GlobalTransactionsFiltersComponent;
  let fixture: ComponentFixture<GlobalTransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalTransactionsFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalTransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
