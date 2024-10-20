import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../image/image.module';
import { CardListComponent } from './card-list.component';

@NgModule({
  declarations: [CardListComponent],
  imports: [CommonModule, MatIconModule, ImageModule, RouterModule],
  exports: [CardListComponent],
})
export class CardListModule {}
