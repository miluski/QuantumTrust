import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ProductTypesService } from '../../services/product-types.service';
import { UserService } from '../../services/user.service';
import { FooterComponent } from './footer.component';
import { FooterModule } from './footer.module';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let productTypesServiceSpy: jasmine.SpyObj<ProductTypesService>;
  let appInformationStatesServiceSpy: jasmine.SpyObj<AppInformationStatesService>;

  beforeEach(async () => {
    productTypesServiceSpy = jasmine.createSpyObj('ProductTypesService', [
      'changeAccountType',
      'changeCardType',
      'changeDepositType',
    ]);
    productTypesServiceSpy.currentAccountType = of(
      'business'
    ) as Observable<string>;
    productTypesServiceSpy.currentCardType = of('premium');
    productTypesServiceSpy.currentDepositType = of('instant');
    appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName', 'changeTransactionsArrayLength']
    );
    appInformationStatesServiceSpy.currentTabName = of(
      'SingleAccountTransactions'
    );
    appInformationStatesServiceSpy.currentTransactionsArrayLength = of(25);
    userServiceSpy = jasmine.createSpyObj('UserService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [FooterModule],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ActivatedRoute, useValue: {} },
        { provide: UserService, useValue: userServiceSpy },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.accountType).toBe('business');
    expect(component.cardType).toBe('premium');
    expect(component.depositType).toBe('instant');
    expect(component.currentTabName).toBe('SingleAccountTransactions');
    expect(component.currentTransactionsArrayLength).toBe(25);
  });

  it('should change account type', () => {
    component.changeAccountType('corporate');
    expect(productTypesServiceSpy.changeAccountType).toHaveBeenCalledWith(
      'corporate'
    );
  });

  it('should change card type', () => {
    component.changeCardType('gold');
    expect(productTypesServiceSpy.changeCardType).toHaveBeenCalledWith('gold');
  });

  it('should change deposit type', () => {
    component.changeDepositType('monthly');
    expect(productTypesServiceSpy.changeDepositType).toHaveBeenCalledWith(
      'monthly'
    );
  });

  it('should change tab name', () => {
    component.changeTabName('AccountOverview');
    expect(appInformationStatesServiceSpy.changeTabName).toHaveBeenCalledWith(
      'AccountOverview'
    );
  });

  it('should determine if footer can be sticky', () => {
    expect(component.canBeSticky).toBeTrue();
  });

  it('should not sticky if transactions array length is less than or equal to 20', () => {
    appInformationStatesServiceSpy.changeTransactionsArrayLength(20);
    fixture.detectChanges();
    expect(component.canBeSticky).toBeTrue();
  });

  it('should be sticky if current tab name is not eligible', () => {
    appInformationStatesServiceSpy.changeTabName('OtherTab');
    fixture.detectChanges();
    expect(component.canBeSticky).toBeTrue();
  });
});
