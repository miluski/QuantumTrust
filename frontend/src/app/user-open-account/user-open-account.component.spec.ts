import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpenAccountComponent } from './user-open-account.component';

describe('UserOpenAccountComponent', () => {
  let component: UserOpenAccountComponent;
  let fixture: ComponentFixture<UserOpenAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserOpenAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOpenAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
