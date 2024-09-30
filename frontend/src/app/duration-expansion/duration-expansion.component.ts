import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component DurationExpansionComponent
 * @description A standalone Angular component that provides a UI for selecting a duration filter.
 *
 * @selector app-duration-expansion
 * @templateUrl ./duration-expansion.component.html
 * @imports [MatExpansionModule, MatRadioButton, CommonModule, FormsModule]
 *
 * @input {Transaction[][]} transactionsArray - An array of transaction arrays to be filtered.
 *
 * @property {boolean} isExpanded - Indicates whether the expansion panel is expanded.
 * @property {String[]} options - List of duration options available for selection.
 *
 * @constructor
 * @param {FiltersService} filtersService - Service for managing filter states.
 * @param {AppInformationStatesService} appInformationStatesService - Service for managing application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component, resets selected filters, and subscribes to expansion flag changes.
 * @method isChecked - Determines if a given option is currently selected.
 * @param {String} option - The option to check.
 * @returns {string} - 'true' if the option is selected, otherwise 'false'.
 *
 * @method changeCheckedOption - Updates the selected filter option.
 * @param {String} option - The option to set as selected.
 * @returns {void}
 */
@Component({
  selector: 'app-duration-expansion',
  templateUrl: './duration-expansion.component.html',
  imports: [MatExpansionModule, MatRadioButton, CommonModule, FormsModule],
  standalone: true,
})
export class DurationExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  public isExpanded: boolean = false;
  public options: String[] = [
    'Ostatni dzień',
    'Ostatni tydzień',
    'Ostatni miesiąc',
    'Ostatnie pół roku',
    'Ostatni rok',
    'Domyślnie',
  ];
  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.filtersService.currentExpansionFlagsArray.subscribe(
      (expansionFlagsArray: boolean[]) =>
        (this.isExpanded = expansionFlagsArray[1])
    );
  }
  isChecked(option: String): string {
    return option === this.filtersService.actualSelectedFilters[1]
      ? 'true'
      : 'false';
  }
  changeCheckedOption(option: String): void {
    const newSelectedFilters: string[] =
      this.filtersService.actualSelectedFilters;
    newSelectedFilters[1] = option as string;
    this.filtersService.setSelectedFilters(newSelectedFilters);
  }
}
