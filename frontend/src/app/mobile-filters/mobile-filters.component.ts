import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * @component MobileFiltersComponent
 * @description This component is responsible for displaying and managing the mobile filters for transactions.
 *
 * @selector app-mobile-filters
 * @templateUrl ./mobile-filters.component.html
 *
 * @class MobileFiltersComponent
 * @implements OnInit
 *
 * @property {Transaction[][]} transactionsArray - An array of arrays of transactions.
 * @property {boolean} isOpened - Flag indicating if the mobile filters are opened.
 *
 * @constructor
 * @param {BreakpointObserver} breakpointObserver - Service to observe breakpoints.
 * @param {FiltersService} filtersService - Service to manage filters.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentIsMobileFiltersOpened observable and observes breakpoints.
 * @method observeBreakpoints - Observes breakpoints to manage the state of mobile filters.
 */
@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
})
export class MobileFiltersComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];

  public isOpened: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected filtersService: FiltersService
  ) {
    this.isOpened = false;
  }

  public ngOnInit(): void {
    this.filtersService.currentIsMobileFiltersOpened.subscribe(
      (isOpened: boolean) => {
        this.isOpened = isOpened;
      }
    );
    this.observeBreakpoints();
  }

  public observeBreakpoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          this.filtersService.setIsMobileFiltersOpened(false);
        }
      });
  }
}
