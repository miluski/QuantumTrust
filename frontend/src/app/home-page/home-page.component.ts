import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { WindowEventsService } from '../../services/window-events.service';

/**
 * @component HomePageComponent
 * @description This component is responsible for displaying and managing the home page of the application.
 *
 * @selector app-home-page
 * @templateUrl ./home-page.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class HomePageComponent
 * @implements OnInit
 *
 * @property {boolean} isDrawerOpened - Flag indicating if the drawer is opened.
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a browser.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {WindowEventsService} windowEventsService - Service to manage window events.
 * @param {AlertService} alertService - Service to manage alerts.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentIsDrawerOpened observable.
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  animations: [AnimationsProvider.animations],
})
export class HomePageComponent implements OnInit {
  protected isDrawerOpened: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    protected windowEventsService: WindowEventsService,
    protected alertService: AlertService
  ) {
    this.isDrawerOpened = false;
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.appInformationStatesService.currentIsDrawerOpened.subscribe(
        (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
      );
    }
  }
}
