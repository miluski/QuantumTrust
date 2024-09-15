import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-sort-expansion',
  templateUrl: './sort-expansion.component.html',
  imports: [MatRadioModule, CommonModule, FormsModule],
  standalone: true,
})
export class SortExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  protected isExpanded: boolean = false;
  protected options: String[] = [
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
    this.filtersService.resetSelectedFilters();
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
