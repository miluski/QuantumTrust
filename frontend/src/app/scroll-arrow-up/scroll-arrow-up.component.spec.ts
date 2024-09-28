import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollArrowUpComponent } from './scroll-arrow-up.component';

describe('ScrollArrowUpComponent', () => {
  let component: ScrollArrowUpComponent;
  let fixture: ComponentFixture<ScrollArrowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollArrowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollArrowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
