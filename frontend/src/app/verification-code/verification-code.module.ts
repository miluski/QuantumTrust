import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { VerificationCodeComponent } from './verification-code.component';

@NgModule({
  declarations: [VerificationCodeComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    FormsModule,
    ImageModule,
    RouterModule,
  ],
  exports: [VerificationCodeComponent],
})
export class VerificationCodeModule {}
