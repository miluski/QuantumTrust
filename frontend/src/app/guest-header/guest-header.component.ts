import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component GuestHeaderComponent
 * @description This component is responsible for displaying and managing the header section for guest users.
 *
 * @selector app-guest-header
 * @templateUrl ./guest-header.component.html
 *
 * @class GuestHeaderComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method toggleDrawer - Toggles the drawer state using the appInformationStatesService.
 */
@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
})
export class GuestHeaderComponent implements OnInit {
  public tabName: string;
  public currentRoute: string;

  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.tabName = 'Konta';
    this.currentRoute = router.url;
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
  }

  public changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
}
