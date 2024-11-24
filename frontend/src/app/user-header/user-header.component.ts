import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';

/**
 * @component UserHeaderComponent
 * @description This component is responsible for displaying and managing the header section for authenticated users.
 *
 * @selector app-user-header
 * @templateUrl ./user-header.component.html
 *
 * @class UserHeaderComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 * @property {boolean} isMenuVisible - Flag indicating if the menu is visible.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ChangeDetectorRef} cdr - Service to detect changes.
 * @param {UserService} userService - Service to manage user data.
 * @param {AvatarService} avatarService - Service to manage user avatar.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable.
 * @method ngAfterViewInit - Lifecycle hook that is called after the component's view has been fully initialized. Detects changes.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService. Logs out the user if the tab name is 'Konta'.
 * @param {string} tabName - The new tab name to be set.
 * @method toggleDrawer - Toggles the drawer state using the appInformationStatesService.
 * @method toggleMenuVisible - Toggles the visibility of the menu.
 * @method handleAvatarError - Handles the avatar error event by setting the avatarError flag to true.
 * @method userFullName - Returns the full name of the user.
 * @method avatarUrl - Returns the URL of the user's avatar.
 */
@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
})
export class UserHeaderComponent implements OnInit {
  public tabName: string;
  public currentRoute: string;
  public isMenuVisible: boolean;

  constructor(
    private router: Router,
    private appInformationStatesService: AppInformationStatesService,
    private cdr: ChangeDetectorRef,
    protected userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.tabName = 'Finanse';
    this.currentRoute = '/main-page';
    this.isMenuVisible = false;
    this.currentRoute = router.url;
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
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

  public toggleMenuVisible(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  public handleAvatarError() {
    this.avatarService.avatarError = true;
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