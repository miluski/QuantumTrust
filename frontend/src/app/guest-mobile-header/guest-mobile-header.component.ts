import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component GuestMobileHeaderComponent
 * @description This component is responsible for displaying and managing the mobile header section for guest users.
 *
 * @selector app-guest-mobile-header
 * @templateUrl ./guest-mobile-header.component.html
 *
 * @class GuestMobileHeaderComponent
 * @implements OnInit, AfterViewInit
 *
 * @property {MatDrawer} drawer - The drawer component for the mobile header.
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable and observes breakpoints.
 * @method ngAfterViewInit - Lifecycle hook that is called after the component's view has been fully initialized. Changes the drawer in the appInformationStatesService.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method toggleDrawer - Toggles the drawer state using the appInformationStatesService.
 */
@Component({
  selector: 'app-guest-mobile-header',
  templateUrl: './guest-mobile-header.component.html',
})
export class GuestMobileHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;

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
    this.appInformationStatesService.observeBreakpoints();
  }

  public ngAfterViewInit(): void {
    this.appInformationStatesService.changeDrawer(this.drawer);
  }

  public changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
}
