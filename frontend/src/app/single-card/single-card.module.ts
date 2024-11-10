import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ImageModule } from '../image/image.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { SingleCardComponent } from './single-card.component';

@NgModule({
  declarations: [SingleCardComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ImageModule,
    MatDividerModule,
    ScrollArrowUpModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: SingleCardComponent,
      },
    ]),
  ],
  exports: [SingleCardComponent],
})
export class SingleCardModule {}
