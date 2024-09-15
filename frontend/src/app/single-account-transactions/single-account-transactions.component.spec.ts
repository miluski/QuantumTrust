import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAccountTransactionsComponent } from './single-account-transactions.component';

describe('SingleAccountTransactionsComponent', () => {
  let component: SingleAccountTransactionsComponent;
  let fixture: ComponentFixture<SingleAccountTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleAccountTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
