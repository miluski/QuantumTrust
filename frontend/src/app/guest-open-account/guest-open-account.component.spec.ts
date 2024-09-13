import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestOpenAccountComponent } from './guest-open-account.component';

describe('GuestOpenAccountComponent', () => {
  let component: GuestOpenAccountComponent;
  let fixture: ComponentFixture<GuestOpenAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestOpenAccountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestOpenAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
