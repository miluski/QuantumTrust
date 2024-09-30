import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

/**
 * Component for filtering global transactions on mobile devices.
 * 
 * @selector app-mobile-global-transactions-filters
 * @templateUrl ./mobile-global-transactions-filters.component.html
 * @imports CommonModule
 * @standalone true
 * 
 * @class MobileGlobalTransactionsFiltersComponent
 * @implements OnInit
 * 
 * @constructor
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service for managing global transaction filters.
 * 
 * @method ngOnInit
 * @description Initializes the component and sets the default applied filter to 'Wszystkie'.
 */
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
