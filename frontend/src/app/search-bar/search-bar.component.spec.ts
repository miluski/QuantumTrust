import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersService } from '../../services/filters.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { Transaction } from '../../types/transaction';
import { SearchBarComponent } from './search-bar.component';
import { SearchBarModule } from './search-bar.module';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let filtersService: FiltersService;
  let globalTransactionsFiltersService: GlobalTransactionsFiltersService;
  beforeEach(async () => {
    const filtersServiceSpy = jasmine.createSpyObj('FiltersService', [
      'setSearchPhrase',
      'applyFilters',
    ]);
    const globalTransactionsFiltersServiceSpy = jasmine.createSpyObj(
      'GlobalTransactionsFiltersService',
      ['setAppliedFilter']
    );
    await TestBed.configureTestingModule({
      imports: [FormsModule, MatTooltipModule, SearchBarModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceSpy },
        {
          provide: GlobalTransactionsFiltersService,
          useValue: globalTransactionsFiltersServiceSpy,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    globalTransactionsFiltersService = TestBed.inject(
      GlobalTransactionsFiltersService
    );
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update search phrase and call setSearchPhrase on changeSearchPhrase', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.changeSearchPhrase(event);
    expect(component['searchPhrase']).toBe('test');
    expect(filtersService.setSearchPhrase).toHaveBeenCalledWith('test');
  });
  it('should call onSearch on Enter key press in onKeydown', () => {
    spyOn(component, 'onSearch');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeydown(event);
    expect(component.onSearch).toHaveBeenCalled();
  });
  it('should not call onSearch on non-Enter key press in onKeydown', () => {
    spyOn(component, 'onSearch');
    const event = new KeyboardEvent('keydown', { key: 'A' });
    component.onKeydown(event);
    expect(component.onSearch).not.toHaveBeenCalled();
  });
  it('should call setAppliedFilter on global filterServiceType in onSearch', () => {
    component.filterServiceType = 'global';
    component['searchPhrase'] = 'test';
    component.onSearch();
    expect(
      globalTransactionsFiltersService.setAppliedFilter
    ).toHaveBeenCalledWith(
      globalTransactionsFiltersService.actualAppliedFilter,
      'test'
    );
  });
  it('should call applyFilters on non-global filterServiceType in onSearch', () => {
    component.filterServiceType = 'non-global';
    component.transactionsArray = [[{ id: 1, amount: 100 } as Transaction]];
    component.onSearch();
    expect(filtersService.applyFilters).toHaveBeenCalledWith(
      true,
      component.transactionsArray
    );
  });
});
