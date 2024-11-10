import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomAlertComponent } from './custom-alert.component';

@NgModule({
  declarations: [CustomAlertComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [CustomAlertComponent],
})
export class CustomAlertModule {}
