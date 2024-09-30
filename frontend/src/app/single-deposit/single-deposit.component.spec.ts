import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { SingleDepositComponent } from './single-deposit.component';

describe('SingleDepositComponent', () => {
  let component: SingleDepositComponent;
  let fixture: ComponentFixture<SingleDepositComponent>;
  let productTypesService: jasmine.SpyObj<ProductTypesService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  beforeEach(async () => {
    const productTypesServiceSpy = jasmine.createSpyObj('ProductTypesService', [
      'currentDepositType',
      'changeDepositType',
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getMonths',
    ]);
    await TestBed.configureTestingModule({
      imports: [FormsModule, SingleDepositComponent],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleDepositComponent);
    component = fixture.componentInstance;
    productTypesService = TestBed.inject(
      ProductTypesService
    ) as jasmine.SpyObj<ProductTypesService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    productTypesService.currentDepositType = of('timely');
    convertService.getMonths.and.returnValue(12);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default values', () => {
    component.ngOnInit();
    expect(component.depositType).toBe('timely');
    expect(component.initialCapital).toBe(100);
    expect(component.interval).toBe(1);
    expect(component.profit).toBe(2);
  });
  it('should calculate profit correctly for non-progressive deposit', () => {
    component.depositObject = { type: 'timely', percent: 5 } as Deposit;
    component.initialCapital = 1000;
    component.interval = 12;
    component.calculateProfit();
    expect(component.profit).toBe(
      Math.round(((1000 * 5) / 100) * (12 / 12) * 0.83)
    );
  });
  it('should calculate profit correctly for progressive deposit', () => {
    component.depositObject = { type: 'progressive', percent: 5 } as Deposit;
    component.initialCapital = 1000;
    component.interval = 12;
    component.calculateProfit();
    let rate = 5;
    let totalProfit = 0;
    for (let i = 1; i <= 12; i++) {
      if (i > 3) {
        rate += 1;
      }
      totalProfit += (1000 * rate) / 100 / 12;
    }
    expect(component.profit).toBe(Math.round(totalProfit * 0.83));
  });
  it('should validate initial capital correctly', () => {
    const ngModel = { invalid: true, dirty: true, touched: true } as NgModel;
    expect(component.getIsInitialCapitalInvalid(ngModel)).toBeTrue();
    expect(component.isInitialCapitalInValid).toBeTrue();
  });
  it('should retrieve the correct deposit object', () => {
    component.depositType = 'timely';
    expect(component.getDepositObject()).toEqual(
      depositsObjectArray.find((deposit) => deposit.type === 'timely')!
    );
  });
});
