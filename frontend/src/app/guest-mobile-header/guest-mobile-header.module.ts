import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { GuestMobileHeaderComponent } from './guest-mobile-header.component';

@NgModule({
  declarations: [GuestMobileHeaderComponent],
  imports: [CommonModule, RouterModule, MatDrawer],
  exports: [GuestMobileHeaderComponent],
})
export class GuestMobileHeaderModule {}
