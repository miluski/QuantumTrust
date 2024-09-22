import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileGlobalTransactionsFiltersComponent } from './mobile-global-transactions-filters.component';

describe('MobileGlobalTransactionsFiltersComponent', () => {
  let component: MobileGlobalTransactionsFiltersComponent;
  let fixture: ComponentFixture<MobileGlobalTransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileGlobalTransactionsFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileGlobalTransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
