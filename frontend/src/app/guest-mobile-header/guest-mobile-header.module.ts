import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuestMobileHeaderComponent } from './guest-mobile-header.component';
import { MatDrawer } from '@angular/material/sidenav';

@NgModule({
  declarations: [GuestMobileHeaderComponent],
  imports: [CommonModule, MatDrawer],
  exports: [GuestMobileHeaderComponent],
})
export class GuestMobileHeaderModule {}
