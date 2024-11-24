import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';

/**
 * @component UserMobileHeaderComponent
 * @description This component is responsible for displaying and managing the header section for authenticated users on mobile devices.
 *
 * @selector app-user-mobile-header
 * @templateUrl ./user-mobile-header.component.html
 *
 * @class UserMobileHeaderComponent
 *
 * @property {MatDrawer} drawer - Reference to the MatDrawer component.
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {UserService} userService - Service to manage user data.
 * @param {AvatarService} avatarService - Service to manage user avatar.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable and observes breakpoints.
 * @method ngAfterViewInit - Lifecycle hook that is called after the component's view has been fully initialized. Changes the drawer reference in the appInformationStatesService.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService. Logs out the user if the tab name is 'Konta'.
 * @param {string} tabName - The new tab name to be set.
 * @method toggleDrawer - Toggles the drawer state using the appInformationStatesService.
 * @method userFullName - Returns the full name of the user.
 * @method avatarUrl - Returns the URL of the user's avatar.
 */
@Component({
  selector: 'app-user-mobile-header',
  templateUrl: './user-mobile-header.component.html',
})
export class UserMobileHeaderComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  public tabName: string;
  public currentRoute: string;

  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService,
    protected userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.tabName = 'Konta';
    this.currentRoute = '/home-page';
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
    if (tabName === 'Konta') {
      this.userService.logout();
    }
    this.appInformationStatesService.changeTabName(tabName);
  }

  public toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }

  public get userFullName(): string {
    return this.userService.userAccount
      ? this.userService.userAccount.firstName +
          ' ' +
          this.userService.userAccount.lastName
      : '';
  }

  public get avatarUrl(): string {
    return this.userService.userAccount
      ? this.userService.userAccount.avatarUrl
      : '';
  }
}
