import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImageModule } from '../image/image.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { NewTransferComponent } from './new-transfer.component';

@NgModule({
  declarations: [NewTransferComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ImageModule,
    FormsModule,
    VerificationCodeModule,
  ],
  exports: [NewTransferComponent],
})
export class NewTransferModule {}
