import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [FormsModule],
  standalone: true,
})
export class SearchBarComponent {
  @Input() transactionsArray!: Transaction[][];
  constructor(public filtersService: FiltersService) {}
  changeSearchPhrase(event: Event): void {
    const searchPhrase: string = (event.target as HTMLInputElement).value;
    this.filtersService.setSearchPhrase(searchPhrase);
  }
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  onSearch(): void {
    this.filtersService.applyFilters(true, this.transactionsArray);
  }
}
