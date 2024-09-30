import { TestBed } from '@angular/core/testing';
import { ShakeStateService } from './shake-state.service';

describe('ShakeStateService', () => {
  let service: ShakeStateService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShakeStateService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set and get the shake state', () => {
    service.setCurrentShakeState('shake');
    expect(service.shakeState).toBe('shake');
  });
  it('should reset the shake state to none after timeout', (done) => {
    service.setCurrentShakeState('shake');
    setTimeout(() => {
      expect(service.shakeState).toBe('none');
      done();
    }, 600);
  });
  it('should increment site number when shake state is set to none', () => {
    const initialSiteNumber = service.siteNumber;
    service.setCurrentShakeState('none');
    expect(service.siteNumber).toBe(initialSiteNumber + 1);
  });
  it('should not increment site number when shake state is set to shake', () => {
    const initialSiteNumber = service.siteNumber;
    service.setCurrentShakeState('shake');
    expect(service.siteNumber).toBe(initialSiteNumber);
  });
  it('should not increment site number when shake state is set to empty string', () => {
    const initialSiteNumber = service.siteNumber;
    service.setCurrentShakeState('');
    expect(service.siteNumber).toBe(initialSiteNumber);
  });
});
