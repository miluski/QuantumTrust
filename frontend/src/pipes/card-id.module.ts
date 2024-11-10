import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardIdFormatPipe } from './card-id-format.pipe';

@NgModule({
  declarations: [CardIdFormatPipe],
  imports: [CommonModule],
  exports: [CardIdFormatPipe],
})
export class CardIdModule {}
