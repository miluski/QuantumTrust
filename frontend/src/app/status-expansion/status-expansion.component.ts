import { Component, Input, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component StatusExpansionComponent
 * @description This component is responsible for displaying and managing the status expansion options for transactions.
 *
 * @selector app-status-expansion
 * @templateUrl ./status-expansion.component.html
 *
 * @class StatusExpansionComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} transactionsArray - An array of arrays of transactions.
 * @property {String[]} options - An array of status options.
 * @property {boolean} isExpanded - Flag indicating if the component is expanded.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service to manage filters.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentExpansionFlagsArray observable.
 * @method isChecked - Checks if the given option is the currently selected filter.
 * @param {String} option - The option to be checked.
 * @returns {string} - Returns 'true' if the option is selected, otherwise 'false'.
 * @method changeCheckedOption - Changes the currently selected filter option.
 * @param {String} option - The new option to be selected.
 */
@Component({
  selector: 'app-status-expansion',
  templateUrl: './status-expansion.component.html',
})
export class StatusExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];

  public options: String[];
  public isExpanded: boolean;

  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {
    this.options = ['Blokada', 'Rozliczona', 'Domyślnie'];
    this.isExpanded = false;
  }

  public ngOnInit(): void {
    this.filtersService.currentExpansionFlagsArray.subscribe(
      (expansionFlagsArray: boolean[]) =>
        (this.isExpanded = expansionFlagsArray[2])
    );
  }

  public isChecked(option: String): string {
    return option === this.filtersService.actualSelectedFilters[2]
      ? 'true'
      : 'false';
  }

  public changeCheckedOption(option: String): void {
    const newSelectedFilters: string[] =
      this.filtersService.actualSelectedFilters;
    newSelectedFilters[2] = option as string;
    this.filtersService.setSelectedFilters(newSelectedFilters);
  }
}
