import { ChangeDetectorRef } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ItemSelectionService } from '../../services/item-selection.service';
import { ProductTypesService } from '../../services/product-types.service';
import { UserService } from '../../services/user.service';
import { CustomAlertModule } from '../custom-alert/custom-alert.module';
import { FinancesModule } from '../finances/finances.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { MainPageComponent } from './main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<any>;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockProductTypesService: jasmine.SpyObj<ProductTypesService>;
  let mockItemSelectionService: jasmine.SpyObj<ItemSelectionService>;
  let mockAppInformationStatesService: jasmine.SpyObj<AppInformationStatesService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['show']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('someValue'),
        },
      },
    };

    mockProductTypesService = jasmine.createSpyObj('ProductTypesService', [
      'currentAccountType',
      'currentCardType',
      'currentDepositType',
      'changeAccountType',
      'changeCardType',
      'changeDepositType',
    ]);
    mockProductTypesService.currentAccountType = of('personal');
    mockProductTypesService.currentCardType = of('standard');
    mockProductTypesService.currentDepositType = of('timely');

    mockAppInformationStatesService = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['currentTabName', 'currentTransactionsArrayLength', 'changeTabName']
    );
    mockAppInformationStatesService.currentTabName = of('defaultTab');
    mockAppInformationStatesService.currentTransactionsArrayLength = of(0);

    mockItemSelectionService = jasmine.createSpyObj('ItemSelectionService', [
      'setUserCardsArray',
    ]);
    mockItemSelectionService.userCards = [];

    mockUserService = jasmine.createSpyObj('UserService', [
      'refreshUserObjects',
      'refreshTokens',
      'userAccounts',
      'userDeposits',
      'userCards',
      'userTransactions',
      'logout'
    ]);
    mockUserService.userAccounts = of([]);
    mockUserService.userDeposits = of([]);
    mockUserService.userCards = of([]);
    mockUserService.userTransactions = of([]);

    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: UserService, useValue: mockUserService },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            routerState: {
              root: {},
            },
          },
        },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductTypesService, useValue: mockProductTypesService },
        { provide: ItemSelectionService, useValue: mockItemSelectionService },
      ],
      imports: [
        HeaderModule,
        FooterModule,
        CustomAlertModule,
        ScrollArrowUpModule,
        FinancesModule,
        BrowserAnimationsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    mockAppInformationStatesService.currentTabName = of('Finanse');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tab name and set it in the service', () => {
    expect(component.tabName).toBe('Finanse');
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });

  it('should subscribe to currentTabName and refresh user objects if tab name is allowed', () => {
    mockAppInformationStatesService.currentTabName = of('Finanse');
    component.ngOnInit();
    expect(component.tabName).toBe('Finanse');
    expect(mockUserService.refreshUserObjects).toHaveBeenCalled();
  });

  it('should reset timers on user activity', fakeAsync(() => {
    spyOn(component as any, 'resetTimers');
    component.onUserActivity();
    expect(component['resetTimers']).toHaveBeenCalled();
  }));

  it('should clear timers on destroy', () => {
    spyOn(component as any, 'clearTimers');
    component.ngOnDestroy();
    expect(component['clearTimers']).toHaveBeenCalled();
  });

  it('should show inactivity alert after 3 minutes of inactivity', fakeAsync(() => {
    component['resetTimers']();
    tick(3 * 60 * 1000);
    expect(mockAlertService.show).toHaveBeenCalled();
    expect(mockUserService.refreshTokens).toHaveBeenCalled();
    flush();
  }));

  it('should logout user after 5 minutes of inactivity', fakeAsync(() => {
    component['resetTimers']();
    tick(5 * 60 * 1000);
    expect(mockAlertService.show).toHaveBeenCalled();
    expect(mockAppInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Konta'
    );
  }));

  it('should clear existing timers when resetting timers', () => {
    spyOn(window, 'clearTimeout');
    component['resetTimers']();
    expect(clearTimeout).toHaveBeenCalled();
  });
});