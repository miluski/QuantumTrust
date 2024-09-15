import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-status-expansion',
  templateUrl: './status-expansion.component.html',
  imports: [CommonModule, MatRadioButton, MatExpansionModule],
  standalone: true,
})
export class StatusExpansionComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  protected isExpanded: boolean = false;
  protected options: String[] = ['Blokada', 'Rozliczona', 'Domyślnie'];
  constructor(
    public filtersService: FiltersService,
    public appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.filtersService.resetSelectedFilters();
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
