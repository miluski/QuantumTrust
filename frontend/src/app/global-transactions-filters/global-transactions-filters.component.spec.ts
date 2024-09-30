import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimationsProvider } from '../../providers/animations.provider';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { GlobalTransactionsFiltersComponent } from './global-transactions-filters.component';

describe('GlobalTransactionsFiltersComponent', () => {
  let component: GlobalTransactionsFiltersComponent;
  let fixture: ComponentFixture<GlobalTransactionsFiltersComponent>;
  let globalTransactionsFiltersService: GlobalTransactionsFiltersService;
  beforeEach(async () => {
    const globalTransactionsFiltersServiceSpy = jasmine.createSpyObj(
      'GlobalTransactionsFiltersService',
      ['setAppliedFilter']
    );
    await TestBed.configureTestingModule({
      imports: [GlobalTransactionsFiltersComponent, CommonModule],
      providers: [
        {
          provide: GlobalTransactionsFiltersService,
          useValue: globalTransactionsFiltersServiceSpy,
        },
        AnimationsProvider,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GlobalTransactionsFiltersComponent);
    component = fixture.componentInstance;
    globalTransactionsFiltersService = TestBed.inject(
      GlobalTransactionsFiltersService
    );
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
