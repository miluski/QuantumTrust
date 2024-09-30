import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { UnauthorizedComponent } from './unauthorized.component';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let appInformationStatesService: AppInformationStatesService;
  beforeEach(async () => {
    const mockRouter = {
      url: '/test-route',
      events: of(new NavigationEnd(0, '/test-route', '/test-route')),
      navigate: jasmine.createSpy('navigate'),
    };
    const mockAppInformationStatesService = {
      currentTabName: of('Test Tab'),
      changeTabName: jasmine.createSpy('changeTabName'),
      toggleDrawer: jasmine.createSpy('toggleDrawer'),
      observeBreakpoints: jasmine.createSpy('observeBreakpoints'),
      changeDrawer: jasmine.createSpy('changeDrawer'),
      currentIsDrawerOpened: of(false),
      currentTransactionsArrayLength: of(25),
    };
    const mockProductTypesService = jasmine.createSpyObj(
      'ProductTypesService',
      ['changeAccountType', 'changeCardType', 'changeDepositType']
    );
    mockProductTypesService.currentAccountType = of(
      'business'
    ) as Observable<string>;
    mockProductTypesService.currentCardType = of('premium');
    mockProductTypesService.currentDepositType = of('instant');
    mockAppInformationStatesService.currentTabName = of(
      'SingleAccountTransactions'
    );
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        HeaderComponent,
        FooterComponent,
        UnauthorizedComponent,
      ],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: mockAppInformationStatesService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ProductTypesService,
          useValue: mockProductTypesService,
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    appInformationStatesService = TestBed.inject(AppInformationStatesService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize isDrawerOpened to false', () => {
    expect(component.isDrawerOpened).toBeFalse();
  });
  it('should subscribe to currentIsDrawerOpened and update isDrawerOpened', () => {
    const newDrawerState = true;
    appInformationStatesService.currentIsDrawerOpened = of(newDrawerState);
    component.ngOnInit();
    expect(component.isDrawerOpened).toBe(newDrawerState);
  });
});
