import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { CustomAlertComponent } from './custom-alert.component';

describe('CustomAlertComponent', () => {
  let component: CustomAlertComponent;
  let fixture: ComponentFixture<CustomAlertComponent>;
  let alertServiceStub: Partial<AlertService>;

  beforeEach(async () => {
    alertServiceStub = {};

    await TestBed.configureTestingModule({
      declarations: [CustomAlertComponent],
      providers: [
        { provide: AlertService, useValue: alertServiceStub },
        { provide: AnimationsProvider, useValue: { animations: [] } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAlertComponent);
    component = fixture.componentInstance;
    component.alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have alertService input', () => {
    expect(component.alertService).toBeDefined();
  });
});
