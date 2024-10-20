import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DepositListComponent } from './deposit-list.component';

@NgModule({
  declarations: [DepositListComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [DepositListComponent],
})
export class DepositListModule {}
