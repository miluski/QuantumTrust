import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { DepositListComponent } from './deposit-list.component';

describe('DepositListComponent', () => {
  let component: DepositListComponent;
  let fixture: ComponentFixture<DepositListComponent>;
  let productTypesServiceMock: any;
  let convertServiceMock: any;
  beforeEach(async () => {
    productTypesServiceMock = {
      currentDepositType: of('timely'),
      changeDepositType: jasmine.createSpy('changeDepositType'),
    };
    convertServiceMock = jasmine.createSpyObj('ConvertService', [
      'getDepositIcon',
      'getPolishDepositType',
    ]);
    await TestBed.configureTestingModule({
      imports: [DepositListComponent],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceMock },
        { provide: ConvertService, useValue: convertServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DepositListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have default tabName as "Lokaty"', () => {
    expect(component.tabName).toBe('Lokaty');
  });
  it('should have default depositType as "timely"', () => {
    expect(component.depositType).toBe('timely');
  });
  it('should initialize depositsObjectArray with depositsObjectArray', () => {
    expect(component.depositsObjectArray).toEqual(depositsObjectArray);
  });
  it('should subscribe to currentDepositType on init', () => {
    component.ngOnInit();
    expect(component.depositType).toBe('timely');
  });
  it('should call changeDepositType on productTypesService when changeDepositType is called', () => {
    component.changeDepositType('newType');
    expect(productTypesServiceMock.changeDepositType).toHaveBeenCalledWith(
      'newType'
    );
  });
  it('should return true if depositId is higher than two', () => {
    expect(component.isDepositIdHigherThanTwo('3')).toBeTrue();
  });
  it('should return false if depositId is not higher than two', () => {
    expect(component.isDepositIdHigherThanTwo('2')).toBeFalse();
  });
});
