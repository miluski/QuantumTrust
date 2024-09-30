import { TestBed } from '@angular/core/testing';
import { ProductTypesService } from './product-types.service';

describe('ProductTypesService', () => {
  let service: ProductTypesService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypesService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have default account type as "personal"', (done) => {
    service.currentAccountType.subscribe((accountType) => {
      expect(accountType).toBe('personal');
      done();
    });
  });
  it('should have default deposit type as "timely"', (done) => {
    service.currentDepositType.subscribe((depositType) => {
      expect(depositType).toBe('timely');
      done();
    });
  });
  it('should have default card type as "standard"', (done) => {
    service.currentCardType.subscribe((cardType) => {
      expect(cardType).toBe('standard');
      done();
    });
  });
  it('should change account type', (done) => {
    service.changeAccountType('business');
    service.currentAccountType.subscribe((accountType) => {
      expect(accountType).toBe('business');
      done();
    });
  });
  it('should change deposit type', (done) => {
    service.changeDepositType('fixed');
    service.currentDepositType.subscribe((depositType) => {
      expect(depositType).toBe('fixed');
      done();
    });
  });
  it('should change card type', (done) => {
    service.changeCardType('premium');
    service.currentCardType.subscribe((cardType) => {
      expect(cardType).toBe('premium');
      done();
    });
  });
});
