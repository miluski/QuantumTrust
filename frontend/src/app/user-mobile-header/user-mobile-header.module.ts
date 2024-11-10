import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { UserMobileHeaderComponent } from './user-mobile-header.component';

@NgModule({
  declarations: [UserMobileHeaderComponent],
  imports: [CommonModule, ImageModule, RouterModule, MatDrawer],
  exports: [UserMobileHeaderComponent],
})
export class UserMobileHeaderModule {}
