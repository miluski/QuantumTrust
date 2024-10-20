import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

/**
 * @fileoverview UserHeaderComponent is a standalone Angular component that represents the header section for a user.
 * It includes functionality for managing the current route, tab name, and menu visibility.
 *
 * @component
 * @selector app-user-header
 * @templateUrl ./user-header.component.html
 *
 * @class UserHeaderComponent
 * @implements OnInit
 *
 * @property {UserAccount} user - The user account information.
 * @property {string} currentRoute - The current route of the application.
 * @property {string} tabName - The name of the current tab.
 * @property {boolean} isMenuVisible - A flag indicating whether the menu is visible.
 *
 * @constructor
 * @param {Router} router - The Angular Router service.
 * @param {UserService} userService - The service providing user account information.
 * @param {AppInformationStatesService} appInformationStatesService - The service managing application state information.
 * @param {AvatarService} avatarService - The service managing user avatars.
 *
 * @method ngOnInit - Initializes the component and subscribes to the current tab name.
 * @method ngAfterViewInit - Lifecycle hook that is called after the component's view has been fully initialized.
 * @method changeTabName - Changes the current tab name.
 * @param {string} tabName - The new tab name.
 * @method toggleDrawer - Toggles the visibility of the drawer.
 * @method toggleMenuVisible - Toggles the visibility of the menu.
 * @method handleAvatarError -  Handles the error when the avatar image fails to load.
 */
@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
})
export class UserHeaderComponent implements OnInit {
  public user: UserAccount;
  public currentRoute: string = '/main-page';
  public tabName: string = 'Finanse';
  public isMenuVisible: boolean = false;
  constructor(
    router: Router,
    userService: UserService,
    private appInformationStatesService: AppInformationStatesService,
    private cdr: ChangeDetectorRef,
    protected avatarService: AvatarService
  ) {
    this.currentRoute = router.url;
    this.user = userService.userAccount;
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
  toggleMenuVisible(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }
  handleAvatarError() {
    this.avatarService.avatarError = true;
  }
}
