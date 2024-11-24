import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: any;
  let mockAppInformationStatesService: any;

  beforeEach(async () => {
    mockRouter = {
      url: '/test-route',
      events: of(new NavigationEnd(0, '/test-route', '/test-route')),
      navigate: jasmine.createSpy('navigate'),
    };
    mockAppInformationStatesService = {
      currentTabName: of('Test Tab'),
      changeTabName: jasmine.createSpy('changeTabName'),
      toggleDrawer: jasmine.createSpy('toggleDrawer'),
      observeBreakpoints: jasmine.createSpy('observeBreakpoints'),
      changeDrawer: jasmine.createSpy('changeDrawer'),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabName on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Test Tab');
  });

  it('should call changeTabName on AppInformationStatesService when changeTabName is called', () => {
    component.changeTabName('new-tab');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'new-tab'
    );
  });

  it('should return true for isGuestPart if currentRoute is not /main-page', () => {
    expect(component.isGuestPart()).toBeTrue();
  });

  it('should return false for isGuestPart if currentRoute is /main-page', () => {
    mockRouter.url = '/main-page';
    component = new HeaderComponent(
      mockRouter,
      mockAppInformationStatesService
    );
    expect(component.isGuestPart()).toBeFalse();
  });
});
