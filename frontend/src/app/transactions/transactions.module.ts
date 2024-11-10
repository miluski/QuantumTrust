import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { GlobalTransactionsFiltersModule } from '../global-transactions-filters/global-transactions-filters.module';
import { MobileGlobalTransactionsFiltersModule } from '../mobile-global-transactions-filters/mobile-global-transactions-filters.module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { TransactionsComponent } from './transactions.component';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    GlobalTransactionsFiltersModule,
    SearchBarModule,
    MatTableModule,
    MatPaginatorModule,
    MobileGlobalTransactionsFiltersModule,
  ],
  exports: [TransactionsComponent],
})
export class TransactionsModule {}
