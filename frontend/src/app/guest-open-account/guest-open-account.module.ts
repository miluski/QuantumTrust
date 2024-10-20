import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CustomAlertModule } from '../custom-alert/custom-alert.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ImageModule } from '../image/image.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { GuestOpenAccountComponent } from './guest-open-account.component';

@NgModule({
  declarations: [GuestOpenAccountComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ImageModule,
    RouterModule,
    MatDividerModule,
    VerificationCodeModule,
    ScrollArrowUpModule,
    CustomAlertModule,
    FooterModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: GuestOpenAccountComponent,
      },
    ]),
  ],
  exports: [GuestOpenAccountComponent],
})
export class GuestOpenAccountModule {}
