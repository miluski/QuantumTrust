import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, ImageModule, RouterModule],
  exports: [FooterComponent],
})
export class FooterModule {}
