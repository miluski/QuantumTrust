import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { GuestHeaderComponent } from './guest-header.component';
import { GuestHeaderModule } from './guest-header.module';

describe('GuestHeaderComponent', () => {
  let component: GuestHeaderComponent;
  let fixture: ComponentFixture<GuestHeaderComponent>;
  let mockRouter = {
    url: '/test-route',
    events: of(new NavigationEnd(0, '/test-route', '/test-route')),
    navigate: jasmine.createSpy('navigate'),
  };
  let mockAppInformationStatesService = {
    currentTabName: of('Test Tab'),
    changeTabName: jasmine.createSpy('changeTabName'),
    toggleDrawer: jasmine.createSpy('toggleDrawer'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestHeaderModule],
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

    fixture = TestBed.createComponent(GuestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentRoute with router url', () => {
    expect(component.currentRoute).toBe('/test-route');
  });

  it('should subscribe to currentTabName and update tabName', () => {
    expect(component.tabName).toBe('Test Tab');
  });

  it('should call changeTabName on AppInformationStatesService when changeTabName is called', () => {
    component.changeTabName('New Tab');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'New Tab'
    );
  });

  it('should call toggleDrawer on AppInformationStatesService when toggleDrawer is called', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });
});
