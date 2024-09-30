import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { CustomAlertComponent } from './custom-alert.component';

describe('CustomAlertComponent', () => {
  let component: CustomAlertComponent;
  let fixture: ComponentFixture<CustomAlertComponent>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  beforeEach(async () => {
    mockAlertService = jasmine.createSpyObj('AlertService', ['close'], {
      isOpened: of(true),
      progressValue: of(50),
    });
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatProgressBarModule,
        CustomAlertComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        AnimationsProvider,
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAlertComponent);
    component = fixture.componentInstance;
    component.alertService = mockAlertService;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set default values for info alert type', () => {
    component.alertType = 'info';
    component.ngOnInit();
    expect(component.progressBarBorderColor).toBe('#276749');
    expect(component.alertIcon).toBe('fa-circle-info');
  });
  it('should set values for warning alert type', () => {
    component.alertType = 'warning';
    component.ngOnInit();
    expect(component.progressBarBorderColor).toBe('#fde047');
    expect(component.alertIcon).toBe('fa-circle-exclamation');
  });
  it('should set values for error alert type', () => {
    component.alertType = 'error';
    component.ngOnInit();
    expect(component.progressBarBorderColor).toBe('#fca5a5');
    expect(component.alertIcon).toBe('fa-circle-xmark');
  });
  it('should set alertTitle and alertContent', () => {
    component.alertTitle = 'Test Title';
    component.alertContent = 'Test Content';
    fixture.detectChanges();
    expect(component.alertTitle).toBe('Test Title');
    expect(component.alertContent).toBe('Test Content');
  });
});
