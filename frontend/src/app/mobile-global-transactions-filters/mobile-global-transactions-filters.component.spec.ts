import { TestBed } from '@angular/core/testing';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { MobileGlobalTransactionsFiltersComponent } from './mobile-global-transactions-filters.component';

describe('MobileGlobalTransactionsFiltersComponent', () => {
  let component: MobileGlobalTransactionsFiltersComponent;
  let globalTransactionsFiltersService: GlobalTransactionsFiltersService;
  beforeEach(() => {
    const globalTransactionsFiltersServiceSpy = jasmine.createSpyObj(
      'GlobalTransactionsFiltersService',
      ['setAppliedFilter']
    );
    TestBed.configureTestingModule({
      imports: [MobileGlobalTransactionsFiltersComponent],
      providers: [
        {
          provide: GlobalTransactionsFiltersService,
          useValue: globalTransactionsFiltersServiceSpy,
        },
      ],
    }).compileComponents();
    globalTransactionsFiltersService = TestBed.inject(
      GlobalTransactionsFiltersService
    );
    const fixture = TestBed.createComponent(
      MobileGlobalTransactionsFiltersComponent
    );
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set default applied filter to "Wszystkie" on init', () => {
    component.ngOnInit();
    expect(
      globalTransactionsFiltersService.setAppliedFilter
    ).toHaveBeenCalledWith('Wszystkie', '');
  });
});
