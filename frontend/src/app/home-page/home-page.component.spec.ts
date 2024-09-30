import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { WindowEventsService } from '../../services/window-events.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let mockAppInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let mockWindowEventsService: jasmine.SpyObj<WindowEventsService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  beforeEach(async () => {
    mockAppInformationStatesService = jasmine.createSpyObj(
      'AppInformationStatesService',
      [],
      {
        currentTabName: of('Test Tab'),
        currentIsDrawerOpened: of(true),
      }
    );
    mockWindowEventsService = jasmine.createSpyObj('WindowEventsService', [
      'startPulsing',
    ]);
    mockAlertService = jasmine.createSpyObj('AlertService', ['']);
    await TestBed.configureTestingModule({
      imports: [HomePageComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: WindowEventsService, useValue: mockWindowEventsService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default tabName and isDrawerOpened values', () => {
    expect(component['tabName']).toBe('Konta');
    expect(component['isDrawerOpened']).toBe(false);
  });
  it('should subscribe to currentTabName and update tabName', () => {
    mockAppInformationStatesService.currentTabName = of('Test Tab');
    component.ngOnInit();
    expect(component['tabName']).toBe('Test Tab');
  });
  it('should subscribe to currentIsDrawerOpened and update isDrawerOpened', () => {
    mockAppInformationStatesService.currentIsDrawerOpened = of(true);
    component.ngOnInit();
    expect(component['isDrawerOpened']).toBe(true);
  });
});
