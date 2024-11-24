import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component NotFoundComponent
 * @description This component is responsible for displaying a "not found" page when a user navigates to an invalid route.
 *
 * @selector app-not-found
 * @templateUrl ./not-found.component.html
 *
 * @class NotFoundComponent
 * @implements OnInit
 *
 * @property {boolean} isDrawerOpened - Flag indicating if the drawer is opened.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {AlertService} alertService - Service to manage alerts.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentIsDrawerOpened observable.
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  public isDrawerOpened: boolean;

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    protected alertService: AlertService
  ) {
    this.isDrawerOpened = false;
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}
