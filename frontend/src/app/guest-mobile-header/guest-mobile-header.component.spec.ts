import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDrawer } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { GuestMobileHeaderComponent } from './guest-mobile-header.component';

describe('GuestMobileHeaderComponent', () => {
  let component: GuestMobileHeaderComponent;
  let fixture: ComponentFixture<GuestMobileHeaderComponent>;
  let mockRouter = {
    url: '/test-route',
    events: of(new NavigationEnd(0, '/test-route', '/test-route')),
    navigate: jasmine.createSpy('navigate'),
  };
  let mockAppInformationStatesService = {
    currentTabName: of('Test Tab'),
    observeBreakpoints: jasmine.createSpy('observeBreakpoints'),
    changeDrawer: jasmine.createSpy('changeDrawer'),
    changeTabName: jasmine.createSpy('changeTabName'),
    toggleDrawer: jasmine.createSpy('toggleDrawer'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestMobileHeaderComponent, BrowserAnimationsModule],
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
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GuestMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize currentRoute with router url', () => {
    expect(component.currentRoute).toBe('/test-route');
  });
  it('should subscribe to currentTabName on init', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Test Tab');
  });
  it('should call observeBreakpoints on init', () => {
    component.ngOnInit();
    expect(
      mockAppInformationStatesService.observeBreakpoints
    ).toHaveBeenCalled();
  });
  it('should call changeDrawer after view init', () => {
    component.drawer = {} as MatDrawer;
    component.ngAfterViewInit();
    expect(mockAppInformationStatesService.changeDrawer).toHaveBeenCalledWith(
      component.drawer
    );
  });
  it('should call changeTabName with the correct parameter', () => {
    const tabName = 'New Tab';
    component.changeTabName(tabName);
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      tabName
    );
  });
  it('should call toggleDrawer', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });
});
