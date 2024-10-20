import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnauthorizedComponent,
      },
    ]),
  ],
  exports: [UnauthorizedComponent],
})
export class UnauthorizedModule {}
