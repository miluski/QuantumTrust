import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { ImageModule } from '../image/image.module';
import { UserMobileHeaderComponent } from './user-mobile-header.component';

describe('UserMobileHeaderComponent', () => {
  let component: UserMobileHeaderComponent;
  let fixture: ComponentFixture<UserMobileHeaderComponent>;
  let mockRouter = { url: '/main-page' };
  let mockAppInformationStatesService = {
    currentTabName: of('Finanse'),
    changeTabName: jasmine.createSpy('changeTabName'),
    toggleDrawer: jasmine.createSpy('toggleDrawer'),
    observeBreakpoints: jasmine.createSpy('observeBreakpoints'),
    changeDrawer: jasmine.createSpy('changeDrawer'),
  };
  let mockUserService = {
    actualUserAccount: of({ avatarUrl: 'http://example.com/avatar.png' }),
    userAccount: { firstName: 'John', lastName: 'Doe' },
    logout: jasmine.createSpy('logout'),
  };
  let mockAvatarService = {
    avatarError: false,
    getInitials: jasmine.createSpy('getInitials'),
  };
  let mockChangeDetectorRef = {
    detectChanges: jasmine.createSpy('detectChanges'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageModule, MatIconModule, MatDrawer, BrowserAnimationsModule],
      declarations: [UserMobileHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: UserService, useValue: mockUserService },
        { provide: AvatarService, useValue: mockAvatarService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabName and currentRoute in constructor', () => {
    expect(component.tabName).toBe('Finanse');
    expect(component.currentRoute).toBe('/main-page');
  });

  it('should subscribe to currentTabName on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Finanse');
    expect(
      mockAppInformationStatesService.observeBreakpoints
    ).toHaveBeenCalled();
  });

  it('should call changeDrawer on ngAfterViewInit', () => {
    component.drawer = {} as MatDrawer;
    component.ngAfterViewInit();
    expect(mockAppInformationStatesService.changeDrawer).toHaveBeenCalledWith(
      component.drawer
    );
  });

  it('should return avatar URL from userService', () => {
    const avatarSrc = component.avatarUrl;
    expect(avatarSrc).toBe('http://example.com/avatar.png');
  });

  it('should only call changeTabName when tabName is not "Konta"', () => {
    component.changeTabName('Other Tab');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Other Tab'
    );
  });

  it('should call toggleDrawer on toggleDrawer', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });
});
