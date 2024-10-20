import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ImageModule } from '../image/image.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { SingleAccountComponent } from './single-account.component';

@NgModule({
  declarations: [SingleAccountComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ImageModule,
    MatDividerModule,
    MatIconModule,
    ScrollArrowUpModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: SingleAccountComponent,
      },
    ]),
  ],
  exports: [SingleAccountComponent],
})
export class SingleAccountModule {}
