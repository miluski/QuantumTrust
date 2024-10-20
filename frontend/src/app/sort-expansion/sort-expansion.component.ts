import { Component, Input, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @fileoverview SortExpansionComponent is a standalone Angular component that handles the logic for sorting transactions.
 * It includes methods for checking and changing the selected sorting option, and initializing the component state.
 *
 * @component
 * @selector app-sort-expansion
 * @templateUrl ./sort-expansion.component.html
 *
 * @class SortExpansionComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} transactionsArray - Input property that holds an array of transactions to be sorted.
 * @property {boolean} isExpanded - Public property that indicates whether the sorting options are expanded.
 * @property {String[]} options - Public property that holds an array of sorting options.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component state and subscribes to expansion flags array.
 * @method isChecked - Checks if a sorting option is selected.
 * @param {String} option - The sorting option to check.
 * @returns {string} - 'true' if the option is selected, otherwise 'false'.
 *
 * @method changeCheckedOption - Changes the selected sorting option.
 * @param {String} option - The new sorting option to select.
 */
@Component({
  selector: 'app-sort-expansion',
  templateUrl: './sort-expansion.component.html',
})
export class SortExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  public isExpanded: boolean = false;
  public options: String[] = [
    'Po dacie rosnąco',
    'Po dacie malejąco',
    'Po kwocie transakcji rosnąco (dla dnia)',
    'Po kwocie transakcji malejąco (dla dnia)',
    'Domyślnie',
  ];
  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.filtersService.currentExpansionFlagsArray.subscribe(
      (expansionFlagsArray: boolean[]) =>
        (this.isExpanded = expansionFlagsArray[0])
    );
  }
  isChecked(option: String): string {
    return option === this.filtersService.actualSelectedFilters[0]
      ? 'true'
      : 'false';
  }
  changeCheckedOption(option: String): void {
    const newSelectedFilters: string[] =
      this.filtersService.actualSelectedFilters;
    newSelectedFilters[0] = option as string;
    this.filtersService.setSelectedFilters(newSelectedFilters);
  }
}
