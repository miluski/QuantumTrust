import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestMobileHeaderComponent } from './guest-mobile-header.component';

describe('GuestMobileHeaderComponent', () => {
  let component: GuestMobileHeaderComponent;
  let fixture: ComponentFixture<GuestMobileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestMobileHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
