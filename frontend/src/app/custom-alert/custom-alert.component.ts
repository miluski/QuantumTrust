import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  animations: [AnimationsProvider.animations],
  imports: [CommonModule, MatProgressBarModule],
  standalone: true,
})
export class CustomAlertComponent implements OnInit {
  @Input() alertType!: 'info' | 'warning' | 'error';
  @Input() alertTitle!: string;
  @Input() alertContent!: string;
  @Input() progressBarBorderColor!: string;
  @Input() alertService!: AlertService;
  public alertIcon!: string;
  ngOnInit(): void {
    switch (this.alertType) {
      case 'info':
      default:
        this.progressBarBorderColor = '#276749';
        this.alertIcon = 'fa-circle-info';
        break;
      case 'warning':
        this.progressBarBorderColor = '#fde047';
        this.alertIcon = 'fa-circle-exclamation';
        break;
      case 'error':
        this.progressBarBorderColor = '#fca5a5';
        this.alertIcon = 'fa-circle-xmark';
        break;
    }
  }
}
