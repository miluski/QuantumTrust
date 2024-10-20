import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GlobalTransactionsFiltersComponent } from './global-transactions-filters.component';

@NgModule({
  declarations: [GlobalTransactionsFiltersComponent],
  imports: [CommonModule],
  exports: [GlobalTransactionsFiltersComponent],
})
export class GlobalTransactionsFiltersModule {}
