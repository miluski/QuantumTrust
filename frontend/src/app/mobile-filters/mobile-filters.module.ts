import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationExpansionModule } from '../duration-expansion/duration-expansion.module';
import { SortExpansionModule } from '../sort-expansion/sort-expansion.module';
import { StatusExpansionModule } from '../status-expansion/status-expansion.module';
import { MobileFiltersComponent } from './mobile-filters.component';

@NgModule({
  declarations: [MobileFiltersComponent],
  imports: [
    CommonModule,
    SortExpansionModule,
    DurationExpansionModule,
    StatusExpansionModule,
  ],
  exports: [MobileFiltersComponent],
})
export class MobileFiltersModule {}
