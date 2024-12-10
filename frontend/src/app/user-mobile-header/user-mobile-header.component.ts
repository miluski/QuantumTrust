import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

/**
 * @component UserMobileHeaderComponent
 * @description This component is responsible for displaying the user header on mobile devices, including the avatar, tab name, and drawer visibility.
 *
 * @selector app-user-mobile-header
 * @templateUrl ./user-mobile-header.component.html
 *
 * @class UserMobileHeaderComponent
 *
 * @property {string} currentAvatarUrl - The URL of the user's current avatar.
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 *
 * @constructor
 * @param {Router} router - The router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {UserService} userService - Service to manage user data.
 * @param {AvatarService} avatarService - Service to manage user avatar.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName and actualUserAccount observables.
 * @method ngAfterViewInit - Lifecycle hook that is called after the view has been initialized. Changes the drawer in the app information states service.
 * @method changeTabName - Changes the tab name and logs out the user if the tab name is 'Konta'.
 * @param {string} tabName - The new tab name to be set.
 * @method toggleDrawer - Toggles the drawer visibility.
 * @method userFullName - Gets the full name of the user.
 * @returns {string} - Returns the full name of the user.
 * @method avatarUrl - Gets the URL of the user's avatar.
 * @returns {string} - Returns the URL of the user's avatar.
 */
@Component({
  selector: 'app-user-mobile-header',
  templateUrl: './user-mobile-header.component.html',
})
export class UserMobileHeaderComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  private currentAvatarUrl: string;

  public tabName: string;
  public currentRoute: string;

  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService,
    protected userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.currentAvatarUrl = '';
    this.tabName = 'Konta';
    this.currentRoute = '/home-page';
    this.currentRoute = router.url;
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
    this.userService.actualUserAccount.subscribe((userAccount: UserAccount) => {
      this.currentAvatarUrl = userAccount.avatarUrl as string;
      this.avatarService.avatarError = false;
    });
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
    const isCurrentAvatarUrlValid: boolean =
      this.currentAvatarUrl !== '' &&
      this.currentAvatarUrl !== null &&
      this.currentAvatarUrl !== undefined;
    if (isCurrentAvatarUrlValid === false) {
      this.avatarService.avatarError = true;
    }
    return isCurrentAvatarUrlValid ? this.currentAvatarUrl : '';
  }
}
