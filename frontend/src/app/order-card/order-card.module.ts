import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImageModule } from '../image/image.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { OrderCardComponent } from './order-card.component';

@NgModule({
  declarations: [OrderCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ImageModule,
    FormsModule,
    VerificationCodeModule,
  ],
  exports: [OrderCardComponent],
})
export class OrderCardModule {}
