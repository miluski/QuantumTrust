import { Component, Input, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component DurationExpansionComponent
 * @description This component is responsible for displaying and managing the duration expansion options for transactions.
 *
 * @selector app-duration-expansion
 * @templateUrl ./duration-expansion.component.html
 *
 * @class DurationExpansionComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} transactionsArray - An array of arrays of transactions.
 * @property {String[]} options - An array of duration options.
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
  selector: 'app-duration-expansion',
  templateUrl: './duration-expansion.component.html',
})
export class DurationExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];

  public options: String[];
  public isExpanded: boolean;

  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {
    this.isExpanded = false;
    this.options = [
      'Ostatni dzień',
      'Ostatni tydzień',
      'Ostatni miesiąc',
      'Ostatnie pół roku',
      'Ostatni rok',
      'Domyślnie',
    ];
  }

  public ngOnInit(): void {
    this.filtersService.currentExpansionFlagsArray.subscribe(
      (expansionFlagsArray: boolean[]) =>
        (this.isExpanded = expansionFlagsArray[1])
    );
  }

  public isChecked(option: String): string {
    return option === this.filtersService.actualSelectedFilters[1]
      ? 'true'
      : 'false';
  }

  public changeCheckedOption(option: String): void {
    const newSelectedFilters: string[] =
      this.filtersService.actualSelectedFilters;
    newSelectedFilters[1] = option as string;
    this.filtersService.setSelectedFilters(newSelectedFilters);
  }
}
