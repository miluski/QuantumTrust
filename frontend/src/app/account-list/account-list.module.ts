import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { AccountListComponent } from './account-list.component';

@NgModule({
  declarations: [AccountListComponent],
  imports: [CommonModule, ImageModule, RouterModule],
  exports: [AccountListComponent],
})
export class AccountListModule {}
