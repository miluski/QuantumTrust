import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { UserHeaderComponent } from './user-header.component';

@NgModule({
  declarations: [UserHeaderComponent],
  imports: [CommonModule, ImageModule, MatIconModule, RouterModule],
  exports: [UserHeaderComponent],
})
export class UserHeaderModule {}
