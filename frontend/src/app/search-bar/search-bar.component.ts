import { Component, Input } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component SearchBarComponent
 * @description This component is responsible for managing the search bar functionality for filtering transactions.
 *
 * @selector app-search-bar
 * @templateUrl ./search-bar.component.html
 *
 * @class SearchBarComponent
 *
 * @property {Transaction[][]} transactionsArray - An array of arrays of transactions.
 * @property {'global' | 'non-global'} filterServiceType - The type of filter service to be used.
 * @property {string} searchPhrase - The search phrase entered by the user.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service to manage global transactions filters.
 *
 * @method changeSearchPhrase - Changes the search phrase based on user input.
 * @param {Event} event - The input event.
 * @method onKeydown - Handles the keydown event to trigger search on Enter key press.
 * @param {KeyboardEvent} event - The keyboard event.
 * @method onSearch - Applies the search filter based on the filter service type.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  @Input() transactionsArray!: Transaction[][];
  @Input() filterServiceType: 'global' | 'non-global';

  private searchPhrase: string = '';

  constructor(
    private filtersService: FiltersService,
    private globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {
    this.filterServiceType = 'global';
  }

  public changeSearchPhrase(event: Event): void {
    this.searchPhrase = (event.target as HTMLInputElement).value;
    this.filtersService.setSearchPhrase(this.searchPhrase);
  }

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  public onSearch(): void {
    this.filterServiceType === 'global'
      ? this.globalTransactionsFiltersService.setAppliedFilter(
          this.globalTransactionsFiltersService.actualAppliedFilter,
          this.searchPhrase
        )
      : this.filtersService.applyFilters(true, this.transactionsArray);
  }
}
