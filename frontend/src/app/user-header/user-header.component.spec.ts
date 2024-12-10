import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserHeaderComponent } from './user-header.component';
import { ImageModule } from '../image/image.module';
import { MatIconModule } from '@angular/material/icon';

describe('UserHeaderComponent', () => {
  let component: UserHeaderComponent;
  let fixture: ComponentFixture<UserHeaderComponent>;
  let mockRouter = { url: '/main-page' };
  let mockAppInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAvatarService: jasmine.SpyObj<AvatarService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockAppInformationStatesService = jasmine.createSpyObj('AppInformationStatesService', [
      'changeTabName',
      'toggleDrawer',
    ], {
      currentTabName: of('Finanse')
    });
    mockUserService = jasmine.createSpyObj('UserService', ['logout'], {
      actualUserAccount: of({ avatarUrl: 'http://example.com/avatar.png' }),
      userAccount: { firstName: 'John', lastName: 'Doe' }
    });
    mockAvatarService = jasmine.createSpyObj('AvatarService', ['']);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [UserHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AppInformationStatesService, useValue: mockAppInformationStatesService },
        { provide: UserService, useValue: mockUserService },
        { provide: AvatarService, useValue: mockAvatarService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
      imports: [ImageModule, MatIconModule]
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
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith('Konta');
    expect(mockUserService.logout).toHaveBeenCalled();
  });

  it('should change tab name without logging out if tab name is not "Konta"', () => {
    component.changeTabName('AnotherTab');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith('AnotherTab');
    expect(mockUserService.logout).not.toHaveBeenCalled();
  });

  it('should toggle drawer', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });

  it('should toggle menu visibility', () => {
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeTrue();
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeFalse();
  });
});