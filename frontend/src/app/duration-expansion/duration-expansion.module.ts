import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DurationExpansionComponent } from './duration-expansion.component';

@NgModule({
  declarations: [DurationExpansionComponent],
  imports: [CommonModule, MatRadioModule],
  exports: [DurationExpansionComponent],
})
export class DurationExpansionModule {}
