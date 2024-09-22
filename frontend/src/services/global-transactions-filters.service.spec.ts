import { TestBed } from '@angular/core/testing';

import { GlobalTransactionsFiltersService } from './global-transactions-filters.service';

describe('GlobalTransactionsFiltersService', () => {
  let service: GlobalTransactionsFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTransactionsFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
