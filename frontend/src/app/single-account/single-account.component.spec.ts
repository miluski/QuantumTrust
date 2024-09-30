import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Account } from '../../types/account';
import { Step } from '../../types/step';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { singleAccountStepsArray } from '../../utils/steps-objects-arrays';
import { SingleAccountComponent } from './single-account.component';

describe('SingleAccountComponent', () => {
  let component: SingleAccountComponent;
  let fixture: ComponentFixture<SingleAccountComponent>;
  let productTypesService: jasmine.SpyObj<ProductTypesService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  beforeEach(async () => {
    const productTypesServiceSpy = jasmine.createSpyObj('ProductTypesService', [
      'currentAccountType',
      'changeAccountType',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', [
      'onResize',
      'setPaginatedArray',
      'handleWidthChange',
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'convert',
      'getPolishAccountType',
    ]);
    productTypesServiceSpy.currentAccountType = of(
      'business'
    ) as Observable<string>;
    productTypesServiceSpy.currentCardType = of('premium');
    productTypesServiceSpy.currentDepositType = of('instant');
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName', 'changeTransactionsArrayLength', 'observeBreakpoints', 'changeDrawer']
    );
    appInformationStatesServiceSpy.currentTabName = of(
      'SingleAccountTransactions'
    );
    appInformationStatesServiceSpy.currentTransactionsArrayLength = of(25);
    await TestBed.configureTestingModule({
      imports: [SingleAccountComponent, BrowserAnimationsModule],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SingleAccountComponent);
    component = fixture.componentInstance;
    productTypesService = TestBed.inject(
      ProductTypesService
    ) as jasmine.SpyObj<ProductTypesService>;
    paginationService = TestBed.inject(
      PaginationService
    ) as jasmine.SpyObj<PaginationService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    convertService.getPolishAccountType.and.returnValue('oszczędnościowe');
    productTypesService.currentAccountType = of('personal');
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(component.accountType).toBe('personal');
    expect(component.steps).toEqual(singleAccountStepsArray);
  });
  it('should set account object on init', () => {
    const expectedAccount = accountsObjectsArray.find(
      (account) => account.type === 'personal'
    ) as Account;
    expect(component.accountObject).toEqual(expectedAccount);
  });
  it('should call setAccountsArray on init', () => {
    spyOn(component as any, 'setAccountsArray');
    component.ngOnInit();
    expect((component as any).setAccountsArray).toHaveBeenCalled();
  });
  it('should update account type and call setAccountsArray when changeAccountType is called', () => {
    spyOn(component as any, 'setAccountsArray');
    component.changeAccountType('business');
    expect(productTypesService.changeAccountType).toHaveBeenCalledWith(
      'business'
    );
    expect((component as any).setAccountsArray).toHaveBeenCalled();
  });
  it('should call paginationService.onResize on window resize', () => {
    const event = new UIEvent('resize');
    component.onResize(event);
    expect(paginationService.onResize).toHaveBeenCalledWith(event);
  });
  it('should return step id in trackById', () => {
    const step: Step = { id: 1, instruction: '', description: '' };
    expect(component.trackById(step)).toBe(1);
  });
  it('should set account object and update paginated array in setAccountsArray', () => {
    const expectedAccount = accountsObjectsArray.find(
      (account) => account.type === 'personal'
    ) as Account;
    component['setAccountsArray']();
    expect(component.accountObject).toEqual(expectedAccount);
    expect(paginationService.setPaginatedArray).toHaveBeenCalledWith(
      accountsObjectsArray.filter(
        (account) => account.id !== expectedAccount.id
      )
    );
    expect(paginationService.handleWidthChange).toHaveBeenCalledWith(
      window.innerWidth
    );
  });
  it('should get account object based on account type', () => {
    const expectedAccount = accountsObjectsArray.find(
      (account) => account.type === 'personal'
    ) as Account;
    expect(component['getAccountObject']()).toEqual(expectedAccount);
  });
});
