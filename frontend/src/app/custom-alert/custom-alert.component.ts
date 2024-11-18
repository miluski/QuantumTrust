import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';

/**
 * CustomAlertComponent is a standalone Angular component that displays an alert with different types and styles.
 * It supports 'info', 'warning', and 'error' alert types, each with its own icon and progress bar border color.
 *
 * @selector app-custom-alert
 * @templateUrl ./custom-alert.component.html
 * @styleUrls ./custom-alert.component.css
 * @animations AnimationsProvider.animations
 *
 * @property {('info' | 'warning' | 'error')} alertType - The type of the alert to display.
 * @property {string} alertTitle - The title of the alert.
 * @property {string} alertContent - The content/message of the alert.
 * @property {string} progressBarBorderColor - The border color of the progress bar.
 * @property {AlertService} alertService - The service used for alert-related operations.
 * @property {string} alertIcon - The icon associated with the alert type.
 *
 * @method ngOnInit - Initializes the component and sets the appropriate styles and icons based on the alert type.
 */
@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  animations: [AnimationsProvider.animations],
})
export class CustomAlertComponent implements AfterViewInit {
  @Input() alertType!: 'info' | 'warning' | 'error';
  @Input() alertTitle!: string;
  @Input() alertContent!: string;
  @Input() progressBarBorderColor!: string;
  @Input() alertService!: AlertService;
  public alertIcon!: string;
  ngAfterViewInit(): void {
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
