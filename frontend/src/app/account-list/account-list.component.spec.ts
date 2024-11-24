import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductTypesService } from '../../services/product-types.service';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { AccountListComponent } from './account-list.component';
import { AccountListModule } from './account-list.module';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let productTypesServiceStub: Partial<ProductTypesService>;

  beforeEach(async () => {
    productTypesServiceStub = {
      currentAccountType: of('business'),
      changeAccountType: jasmine.createSpy('changeAccountType'),
    };

    await TestBed.configureTestingModule({
      imports: [AccountListModule],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceStub },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.accountType).toBe('business');
    expect(component.accountsObjectsArray).toEqual(accountsObjectsArray);
    expect(component.currentIndex).toBe(0);
  });

  it('should change account type', () => {
    const newAccountType = 'savings';
    component.changeAccountType(newAccountType);
    expect(productTypesServiceStub.changeAccountType).toHaveBeenCalledWith(
      newAccountType
    );
  });

  it('should determine if account ID is even', () => {
    expect(component.isAccountIdEven('2')).toBeTrue();
    expect(component.isAccountIdEven('3')).toBeFalse();
  });
  
  it('should update accountType on subscription', () => {
    productTypesServiceStub.currentAccountType = of('personal');
    component.ngOnInit();
    expect(component.accountType).toBe('personal');
  });
});
