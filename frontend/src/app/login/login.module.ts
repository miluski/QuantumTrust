import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CustomAlertModule } from '../custom-alert/custom-alert.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ImageModule } from '../image/image.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MatDividerModule,
    ImageModule,
    VerificationCodeModule,
    CustomAlertModule,
    FooterModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent,
      },
    ]),
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
