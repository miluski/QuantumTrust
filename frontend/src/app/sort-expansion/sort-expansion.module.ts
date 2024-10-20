import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { SortExpansionComponent } from './sort-expansion.component';

@NgModule({
  declarations: [SortExpansionComponent],
  imports: [CommonModule, MatRadioButton],
  exports: [SortExpansionComponent],
})
export class SortExpansionModule {}
