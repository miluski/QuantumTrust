import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { SingleDepositComponent } from './single-deposit.component';

@NgModule({
  declarations: [SingleDepositComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MatDividerModule,
    FormsModule,
    ScrollArrowUpModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: SingleDepositComponent,
      },
    ]),
  ],
  exports: [SingleDepositComponent],
})
export class SingleDepositModule {}
