import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * Component representing the mobile header for guest users.
 *
 * @selector 'app-guest-mobile-header'
 * @templateUrl './guest-mobile-header.component.html'
 *
 * @class GuestMobileHeaderComponent
 * @implements OnInit, AfterViewInit
 *
 * @property {MatDrawer} drawer - Reference to the MatDrawer component.
 * @property {string} currentRoute - The current route of the application.
 * @property {string} tabName - The name of the current tab.
 *
 * @constructor
 * @param {Router} router - Angular Router service.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state.
 *
 * @method ngOnInit - Lifecycle hook that is called after Angular has initialized all data-bound properties.
 * @method ngAfterViewInit - Lifecycle hook that is called after Angular has fully initialized a component's view.
 * @method changeTabName - Changes the name of the current tab.
 * @param {string} tabName - The new name of the tab.
 * @method toggleDrawer - Toggles the state of the drawer.
 */
@Component({
  selector: 'app-guest-mobile-header',
  templateUrl: './guest-mobile-header.component.html',
})
export class GuestMobileHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  public currentRoute: string = '//';
  public tabName: string = 'Konta';
  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
    this.appInformationStatesService.observeBreakpoints();
  }
  ngAfterViewInit(): void {
    this.appInformationStatesService.changeDrawer(this.drawer);
  }
  changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
}
