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
});
