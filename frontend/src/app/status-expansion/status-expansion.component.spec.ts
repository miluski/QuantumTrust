import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusExpansionComponent } from './status-expansion.component';

describe('StatusExpansionComponent', () => {
  let component: StatusExpansionComponent;
  let fixture: ComponentFixture<StatusExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusExpansionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
