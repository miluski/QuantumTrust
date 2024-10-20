import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { OpenDepositComponent } from './open-deposit.component';

@NgModule({
  declarations: [OpenDepositComponent],
  imports: [CommonModule, MatIconModule, FormsModule, VerificationCodeModule],
  exports: [OpenDepositComponent],
})
export class OpenDepositModule {}
