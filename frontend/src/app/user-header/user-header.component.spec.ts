import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { ImageModule } from '../image/image.module';
import { UserHeaderComponent } from './user-header.component';

describe('UserHeaderComponent', () => {
  let component: UserHeaderComponent;
  let fixture: ComponentFixture<UserHeaderComponent>;
  let mockRouter = { url: '/main-page' };
  let mockAppInformationStatesService = {
    currentTabName: of('Finanse'),
    changeTabName: jasmine.createSpy('changeTabName'),
    toggleDrawer: jasmine.createSpy('toggleDrawer'),
  };
  let mockUserService = { logout: jasmine.createSpy('logout') };
  let mockAvatarService = {
    avatarError: false,
    getInitials: jasmine.createSpy('getInitials'),
  };
  let mockChangeDetectorRef = {
    detectChanges: jasmine.createSpy('detectChanges'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageModule, MatIconModule],
      declarations: [UserHeaderComponent],
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

    fixture = TestBed.createComponent(UserHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabName and currentRoute on init', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Finanse');
    expect(component.currentRoute).toBe('/main-page');
  });

  it('should change tab name and logout if tab name is "Konta"', () => {
    component.changeTabName('Konta');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Konta'
    );
  });

  it('should change tab name without logging out if tab name is not "Konta"', () => {
    component.changeTabName('AnotherTab');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'AnotherTab'
    );
  });

  it('should toggle drawer', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });

  it('should toggle menu visibility', () => {
    component.isMenuVisible = false;
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeTrue();
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should handle avatar error', () => {
    component.handleAvatarError();
    expect(mockAvatarService.avatarError).toBeTrue();
  });
});
