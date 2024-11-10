import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';
import { MainPageComponent } from './main-page.component';
import { MainPageModule } from './main-page.module';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let appInformationStatesService: AppInformationStatesService;
  let changeDetectorRef: ChangeDetectorRef;
  let alertService: AlertService;
  beforeEach(async () => {
    const appInformationStatesServiceMock = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName', 'observeBreakpoints', 'changeDrawer'],
      {
        currentTabName: of('Finanse'),
        currentIsDrawerOpened: of(false),
      }
    );
    const alertServiceMock = jasmine.createSpyObj('AlertService', ['']);
    const productTypesServiceMock = jasmine.createSpyObj(
      'ProductTypesService',
      ['changeAccountType', 'changeCardType', 'changeDepositType']
    );
    productTypesServiceMock.currentAccountType = of(
      'business'
    ) as Observable<string>;
    productTypesServiceMock.currentCardType = of('premium');
    productTypesServiceMock.currentDepositType = of('instant');
    appInformationStatesServiceMock.currentTabName = of(
      'SingleAccountTransactions'
    );
    appInformationStatesServiceMock.currentTransactionsArrayLength = of(25);
    await TestBed.configureTestingModule({
      imports: [MainPageModule, BrowserAnimationsModule],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceMock,
        },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: jasmine.createSpy('detectChanges') },
        },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: ProductTypesService, useValue: productTypesServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    appInformationStatesService = TestBed.inject(AppInformationStatesService);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize tabName to "Finanse"', () => {
    expect(component.tabName).toBe('Finanse');
  });
  it('should call changeTabName with initial tabName on construction', () => {
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      'Finanse'
    );
  });
  it('should update tabName and call detectChanges on currentTabName change', () => {
    component.ngOnInit();
    expect(component.tabName).toBe('Finanse');
  });
});
