import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDrawer } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';
import { UserMobileHeaderComponent } from './user-mobile-header.component';
import { UserMobileHeaderModule } from './user-mobile-header.module';

describe('UserMobileHeaderComponent', () => {
  let component: UserMobileHeaderComponent;
  let fixture: ComponentFixture<UserMobileHeaderComponent>;
  let mockRouter: any;
  let mockUserService: any;
  let mockAppInformationStatesService: any;
  let mockAvatarService: any;
  beforeEach(async () => {
    mockRouter = {
      url: '/main-page',
      events: of({}),
      navigate: jasmine.createSpy('navigate'),
    };
    mockUserService = {
      userAccount: new UserAccount(),
    };
    mockAppInformationStatesService = {
      currentTabName: of('Konta'),
      observeBreakpoints: jasmine.createSpy('observeBreakpoints'),
      changeDrawer: jasmine.createSpy('changeDrawer'),
      changeTabName: jasmine.createSpy('changeTabName'),
      toggleDrawer: jasmine.createSpy('toggleDrawer'),
    };
    mockAvatarService = {};
    await TestBed.configureTestingModule({
      imports: [UserMobileHeaderModule, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: AvatarService, useValue: mockAvatarService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize currentRoute and user in constructor', () => {
    expect(component.currentRoute).toBe('/main-page');
    expect(component.user).toBe(mockUserService.userAccount);
  });
  it('should subscribe to currentTabName on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Konta');
    expect(
      mockAppInformationStatesService.observeBreakpoints
    ).toHaveBeenCalled();
  });
  it('should set drawer reference on ngAfterViewInit', () => {
    component.drawer = {} as MatDrawer;
    component.ngAfterViewInit();
    expect(mockAppInformationStatesService.changeDrawer).toHaveBeenCalledWith(
      component.drawer
    );
  });
  it('should change tab name', () => {
    const newTabName = 'New Tab';
    component.changeTabName(newTabName);
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      newTabName
    );
  });
  it('should toggle drawer', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });
});
