import { Component, OnInit } from '@angular/core';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

/**
 * @component MobileGlobalTransactionsFiltersComponent
 * @description This component is responsible for displaying and managing the global transactions filters for mobile view.
 *
 * @selector app-mobile-global-transactions-filters
 * @templateUrl ./mobile-global-transactions-filters.component.html
 *
 * @class MobileGlobalTransactionsFiltersComponent
 * @implements OnInit
 *
 * @constructor
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service to manage global transactions filters.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Sets the applied filter to 'Wszystkie'.
 */
@Component({
  selector: 'app-mobile-global-transactions-filters',
  templateUrl: './mobile-global-transactions-filters.component.html',
})
export class MobileGlobalTransactionsFiltersComponent implements OnInit {
  constructor(
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}

  public ngOnInit(): void {
    this.globalTransactionsFiltersService.setAppliedFilter('Wszystkie', '');
  }
}
