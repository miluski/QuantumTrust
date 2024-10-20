import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardIdModule } from '../../pipes/card-id.module';
import { ImageModule } from '../image/image.module';
import { FinancesComponent } from './finances.component';

@NgModule({
  declarations: [FinancesComponent],
  imports: [CommonModule, MatIconModule, ImageModule, CardIdModule],
  exports: [FinancesComponent],
})
export class FinancesModule {}
