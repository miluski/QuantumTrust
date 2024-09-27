import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

@Component({
  selector: 'app-global-transactions-filters',
  templateUrl: './global-transactions-filters.component.html',
  imports: [CommonModule],
  animations: [AnimationsProvider.animations],
  standalone: true,
})
export class GlobalTransactionsFiltersComponent implements OnInit {
  constructor(
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}
  ngOnInit(): void {
    this.globalTransactionsFiltersService.setAppliedFilter('Wszystkie', '');
  }
}
