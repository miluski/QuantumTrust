import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { StatusExpansionComponent } from './status-expansion.component';

@NgModule({
  declarations: [StatusExpansionComponent],
  imports: [CommonModule, MatRadioButton],
  exports: [StatusExpansionComponent],
})
export class StatusExpansionModule {}
