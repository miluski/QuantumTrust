import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { GuestHeaderComponent } from './guest-header.component';

@NgModule({
  declarations: [GuestHeaderComponent],
  imports: [CommonModule, ImageModule, MatIconModule, RouterModule],
  exports: [GuestHeaderComponent],
})
export class GuestHeaderModule {}
