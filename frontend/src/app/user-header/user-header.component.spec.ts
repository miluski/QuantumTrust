import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';
import { UserHeaderComponent } from './user-header.component';

describe('UserHeaderComponent', () => {
  let component: UserHeaderComponent;
  let fixture: ComponentFixture<UserHeaderComponent>;
  let mockRouter = {
    url: '/main-page',
    events: of({}), 
    navigate: jasmine.createSpy('navigate'),
  };
  let mockUserService = { userAccount: { name: 'Test User' } as UserAccount };
  let mockAppInformationStatesService = {
    currentTabName: of('Finanse'),
    changeTabName: jasmine.createSpy('changeTabName'),
    toggleDrawer: jasmine.createSpy('toggleDrawer'),
  };
  let mockAvatarService = {};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: AvatarService, useValue: mockAvatarService },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with correct values', () => {
    expect(component.currentRoute).toBe('/main-page');
    expect(component.user).toEqual(mockUserService.userAccount);
    expect(component.tabName).toBe('Finanse');
    expect(component.isMenuVisible).toBeFalse();
  });
  it('should subscribe to currentTabName on init', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Finanse');
  });
  it('should change tab name', () => {
    const newTabName = 'New Tab';
    component.changeTabName(newTabName);
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      newTabName
    );
  });
  it('should toggle drawer visibility', () => {
    component.toggleDrawer();
    expect(mockAppInformationStatesService.toggleDrawer).toHaveBeenCalled();
  });
  it('should toggle menu visibility', () => {
    expect(component.isMenuVisible).toBeFalse();
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeTrue();
    component.toggleMenuVisible();
    expect(component.isMenuVisible).toBeFalse();
  });
});
