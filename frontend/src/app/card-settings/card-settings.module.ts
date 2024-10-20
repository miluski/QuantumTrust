import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardIdModule } from '../../pipes/card-id.module';
import { DurationExpansionModule } from '../duration-expansion/duration-expansion.module';
import { ImageModule } from '../image/image.module';
import { MobileFiltersModule } from '../mobile-filters/mobile-filters.module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { SortExpansionModule } from '../sort-expansion/sort-expansion.module';
import { StatusExpansionModule } from '../status-expansion/status-expansion.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { CardSettingsComponent } from './card-settings.component';

@NgModule({
  declarations: [CardSettingsComponent],
  imports: [
    CommonModule,
    ImageModule,
    MatTooltipModule,
    CardIdModule,
    FormsModule,
    SortExpansionModule,
    DurationExpansionModule,
    StatusExpansionModule,
    SearchBarModule,
    VerificationCodeModule,
    MobileFiltersModule,
  ],
  exports: [CardSettingsComponent],
})
export class CardSettingsModule {}
