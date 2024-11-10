import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { WindowEventsService } from '../../services/window-events.service';

/**
 * HomePageComponent is the main component for the home page of the application.
 * It includes various sub-components and handles the state of the home page.
 *
 * @selector 'app-home-page'
 * @templateUrl './home-page.component.html'
 * @animations AnimationsProvider.animations
 *
 * @class HomePageComponent
 * @implements OnInit
 *
 * @method ngOnInit Initializes the component and subscribes to observables for tab name and drawer state.
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  animations: [AnimationsProvider.animations],
})
export class HomePageComponent implements OnInit {
  protected isDrawerOpened: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    protected windowEventsService: WindowEventsService,
    protected alertService: AlertService
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.appInformationStatesService.currentIsDrawerOpened.subscribe(
        (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
      );
    }
  }
}
