import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortExpansionComponent } from './sort-expansion.component';

describe('SortExpansionComponent', () => {
  let component: SortExpansionComponent;
  let fixture: ComponentFixture<SortExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortExpansionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
