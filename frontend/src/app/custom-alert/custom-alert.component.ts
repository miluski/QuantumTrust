import { Component, Input } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';

/**
 * @component CustomAlertComponent
 * @description This component is responsible for displaying custom alerts.
 *
 * @selector app-custom-alert
 * @templateUrl ./custom-alert.component.html
 * @styleUrls ['./custom-alert.component.css']
 * @animations [AnimationsProvider.animations]
 *
 * @class CustomAlertComponent
 *
 * @property {AlertService} alertService - The service to manage alerts.
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
