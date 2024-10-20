import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuestHeaderModule } from '../guest-header/guest-header.module';
import { GuestMobileHeaderModule } from '../guest-mobile-header/guest-mobile-header.module';
import { UserHeaderModule } from '../user-header/user-header.module';
import { UserMobileHeaderModule } from '../user-mobile-header/user-mobile-header.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    GuestHeaderModule,
    GuestMobileHeaderModule,
    UserHeaderModule,
    UserMobileHeaderModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
