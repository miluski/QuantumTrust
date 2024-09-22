import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersService } from '../../services/filters.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [FormsModule, MatTooltipModule],
  standalone: true,
})
export class SearchBarComponent {
  @Input() transactionsArray!: Transaction[][];
  @Input() filterServiceType: 'global' | 'non-global' = 'global';
  private searchPhrase: string = '';
  constructor(
    private filtersService: FiltersService,
    private globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}
  changeSearchPhrase(event: Event): void {
    this.searchPhrase = (event.target as HTMLInputElement).value;
    this.filtersService.setSearchPhrase(this.searchPhrase);
  }
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  onSearch(): void {
    this.filterServiceType === 'global'
      ? this.globalTransactionsFiltersService.setAppliedFilter(
          this.globalTransactionsFiltersService.actualAppliedFilter,
          this.searchPhrase
        )
      : this.filtersService.applyFilters(true, this.transactionsArray);
  }
}
