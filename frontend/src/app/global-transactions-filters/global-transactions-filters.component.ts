import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

/**
 * Component responsible for managing and applying global transaction filters.
 *
 * @selector app-global-transactions-filters
 * @templateUrl ./global-transactions-filters.component.html
 * @animations AnimationsProvider.animations
 *
 * @class GlobalTransactionsFiltersComponent
 * @implements OnInit
 *
 * @constructor
 * @param {GlobalTransactionsFiltersService} globalTransactionsFiltersService - Service to manage global transaction filters.
 *
 * @method ngOnInit
 * @description Initializes the component and sets the default applied filter to 'Wszystkie'.
 */
@Component({
  selector: 'app-global-transactions-filters',
  templateUrl: './global-transactions-filters.component.html',
  animations: [AnimationsProvider.animations],
})
export class GlobalTransactionsFiltersComponent implements OnInit {
  constructor(
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}
  ngOnInit(): void {
    this.globalTransactionsFiltersService.setAppliedFilter('Wszystkie', '');
  }
}
