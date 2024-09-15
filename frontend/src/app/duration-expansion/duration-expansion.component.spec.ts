import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationExpansionComponent } from './duration-expansion.component';

describe('DurationExpansionComponent', () => {
  let component: DurationExpansionComponent;
  let fixture: ComponentFixture<DurationExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationExpansionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
