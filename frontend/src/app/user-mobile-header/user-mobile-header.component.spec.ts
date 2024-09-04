import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMobileHeaderComponent } from './user-mobile-header.component';

describe('UserMobileHeaderComponent', () => {
  let component: UserMobileHeaderComponent;
  let fixture: ComponentFixture<UserMobileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMobileHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
