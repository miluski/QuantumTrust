import { TestBed } from '@angular/core/testing';

import { AppInformationStatesService } from './app-information-states.service';

describe('AppInformationStatesService', () => {
  let service: AppInformationStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInformationStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
