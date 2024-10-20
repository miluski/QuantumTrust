import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ImageModule } from '../image/image.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { UserOpenAccountComponent } from './user-open-account.component';

@NgModule({
  declarations: [UserOpenAccountComponent],
  imports: [
    CommonModule,
    ImageModule,
    FormsModule,
    MatDividerModule,
    VerificationCodeModule,
  ],
  exports: [UserOpenAccountComponent],
})
export class UserOpenAccountModule {}
