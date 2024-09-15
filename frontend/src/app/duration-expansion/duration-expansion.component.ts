import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-duration-expansion',
  templateUrl: './duration-expansion.component.html',
  imports: [MatExpansionModule, MatRadioButton, CommonModule, FormsModule],
  standalone: true,
})
export class DurationExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  protected isExpanded: boolean = false;
  protected options: String[] = [
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
    this.filtersService.resetSelectedFilters();
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
