import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { Transaction } from '../../types/transaction';

/**
 * MobileFiltersComponent is a standalone Angular component that provides
 * a set of filters for mobile views. It observes breakpoint changes to
 * determine if the filters should be opened or closed.
 *
 * @selector 'app-mobile-filters'
 * @templateUrl './mobile-filters.component.html'
 *
 * @property {Transaction[][]} transactionsArray - An array of transaction arrays passed as input.
 * @property {boolean} isOpened - A flag indicating whether the mobile filters are opened.
 *
 * @constructor
 * @param {BreakpointObserver} breakpointObserver - Service to observe media query breakpoints.
 * @param {FiltersService} filtersService - Service to manage filter states.
 *
 * @method ngOnInit - Initializes the component and subscribes to filter state changes.
 * @method observeBreakpoints - Observes breakpoint changes and updates the filter state accordingly.
 */
@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
})
export class MobileFiltersComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  public isOpened: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    protected filtersService: FiltersService
  ) {}
  ngOnInit(): void {
    this.filtersService.currentIsMobileFiltersOpened.subscribe(
      (isOpened: boolean) => {
        this.isOpened = isOpened;
      }
    );
    this.observeBreakpoints();
  }
  observeBreakpoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          this.filtersService.setIsMobileFiltersOpened(false);
        }
      });
  }
}
