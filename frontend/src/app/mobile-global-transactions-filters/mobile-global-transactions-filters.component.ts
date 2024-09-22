import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

@Component({
  selector: 'app-mobile-global-transactions-filters',
  templateUrl: './mobile-global-transactions-filters.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class MobileGlobalTransactionsFiltersComponent implements OnInit {
  constructor(
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}
  ngOnInit(): void {
    this.globalTransactionsFiltersService.setAppliedFilter('Wszystkie', '');
  }
}
