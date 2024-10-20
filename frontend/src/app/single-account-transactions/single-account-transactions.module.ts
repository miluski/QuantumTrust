import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationExpansionModule } from '../duration-expansion/duration-expansion.module';
import { MobileFiltersModule } from '../mobile-filters/mobile-filters.module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { SingleAccountBalanceChartModule } from '../single-account-balance-chart/single-account-balance-chart.module';
import { SortExpansionModule } from '../sort-expansion/sort-expansion.module';
import { StatusExpansionModule } from '../status-expansion/status-expansion.module';
import { SingleAccountTransactionsComponent } from './single-account-transactions.component';

@NgModule({
  declarations: [SingleAccountTransactionsComponent],
  imports: [
    CommonModule,
    SingleAccountBalanceChartModule,
    SortExpansionModule,
    DurationExpansionModule,
    StatusExpansionModule,
    SearchBarModule,
    MobileFiltersModule,
  ],
  exports: [SingleAccountTransactionsComponent],
})
export class SingleAccountTransactionsModule {}
