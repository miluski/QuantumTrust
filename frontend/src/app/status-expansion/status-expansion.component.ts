import { Component, Input, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @fileoverview StatusExpansionComponent is a standalone Angular component that handles the logic for status-based transaction filtering.
 * It includes methods for checking and changing the selected status option, and initializing the component state.
 *
 * @component
 * @selector app-status-expansion
 * @templateUrl ./status-expansion.component.html
 *
 * @class StatusExpansionComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} transactionsArray - Input property that holds an array of transactions to be filtered.
 * @property {boolean} isExpanded - Protected property that indicates whether the status options are expanded.
 * @property {String[]} options - Protected property that holds an array of status options.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component state and subscribes to expansion flags array.
 * @method isChecked - Checks if a status option is selected.
 * @param {String} option - The status option to check.
 * @returns {string} - 'true' if the option is selected, otherwise 'false'.
 *
 * @method changeCheckedOption - Changes the selected status option.
 * @param {String} option - The new status option to select.
 */
@Component({
  selector: 'app-status-expansion',
  templateUrl: './status-expansion.component.html',
})
export class StatusExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  public isExpanded: boolean = false;
  public options: String[] = ['Blokada', 'Rozliczona', 'Domyślnie'];
  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.filtersService.currentExpansionFlagsArray.subscribe(
      (expansionFlagsArray: boolean[]) =>
        (this.isExpanded = expansionFlagsArray[2])
    );
  }
  isChecked(option: String): string {
    return option === this.filtersService.actualSelectedFilters[2]
      ? 'true'
      : 'false';
  }
  changeCheckedOption(option: String): void {
    const newSelectedFilters: string[] =
      this.filtersService.actualSelectedFilters;
    newSelectedFilters[2] = option as string;
    this.filtersService.setSelectedFilters(newSelectedFilters);
  }
}
