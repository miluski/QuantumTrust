import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageModule } from '../image/image.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { AccountSettingsComponent } from './account-settings.component';

@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [CommonModule, FormsModule, ImageModule, VerificationCodeModule],
  exports: [AccountSettingsComponent],
})
export class AccountSettingsModule {}
