import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { DepositListComponent } from '../deposit-list/deposit-list.component';
import { DurationExpansionComponent } from '../duration-expansion/duration-expansion.component';
import { SortExpansionComponent } from '../sort-expansion/sort-expansion.component';
import { StatusExpansionComponent } from '../status-expansion/status-expansion.component';
import { Transaction } from '../../types/transaction';

@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  imports: [
    CommonModule,
    SortExpansionComponent,
    DurationExpansionComponent,
    StatusExpansionComponent,
    DepositListComponent,
  ],
  standalone: true,
})
export class MobileFiltersComponent implements OnInit {
  @Input() transactionsArray!: Transaction[][];
  protected isOpened: boolean = false;
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
