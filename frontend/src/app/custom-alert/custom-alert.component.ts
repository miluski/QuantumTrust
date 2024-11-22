import { Component, Input } from '@angular/core';
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
 * @property {AlertService} alertService - The service used for alert-related operations.
 *
 */
@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  animations: [AnimationsProvider.animations],
})
export class CustomAlertComponent {
  @Input() alertService!: AlertService;
}
