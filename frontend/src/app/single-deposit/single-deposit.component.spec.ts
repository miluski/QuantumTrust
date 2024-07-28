import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDepositComponent } from './single-deposit.component';

describe('SingleDepositComponent', () => {
  let component: SingleDepositComponent;
  let fixture: ComponentFixture<SingleDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
