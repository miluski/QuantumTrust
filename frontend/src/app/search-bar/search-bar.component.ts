import { Component, Input } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component SearchBarComponent
 *
 * A standalone Angular component that represents a search bar.
 * It allows users to input a search phrase and triggers search functionality.
 *
 * @selector app-search-bar
 * @templateUrl ./search-bar.component.html
 *
 * @property {Transaction[][]} transactionsArray - An array of transaction arrays passed as input.
 * @property {'global' | 'non-global'} filterServiceType - The type of filter service to use, defaults to 'global'.
 *
 * @method changeSearchPhrase - Updates the search phrase and sets it in the filters service.
 * @param {Event} event - The input event containing the new search phrase.
 *
 * @method onKeydown - Handles the keydown event, triggers search on 'Enter' key press.
 * @param {KeyboardEvent} event - The keyboard event.
 *
 * @method onSearch - Applies the search filter based on the filter service type.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service to manage global transaction filters.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
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
