import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

/**
 * @fileoverview UserMobileHeaderComponent is a standalone Angular component that represents the mobile header section for a user.
 * It includes functionality for managing the current route, tab name, and drawer visibility.
 *
 * @component
 * @selector app-user-mobile-header
 * @templateUrl ./user-mobile-header.component.html
 *
 * @class UserMobileHeaderComponent
 * @implements OnInit, AfterViewInit, ImageComponent
 *
 * @property {MatDrawer} drawer - The drawer component reference.
 * @property {string} currentRoute - The current route of the application.
 * @property {string} tabName - The name of the current tab.
 * @property {UserAccount} user - The user account information.
 *
 * @constructor
 * @param {Router} router - The Angular Router service.
 * @param {UserService} userService - The service providing user account information.
 * @param {AppInformationStatesService} appInformationStatesService - The service managing application state information.
 * @param {AvatarService} avatarService - The service managing user avatars.
 *
 * @method ngOnInit - Initializes the component and subscribes to the current tab name.
 * @method ngAfterViewInit - Sets the drawer reference in the application state service.
 * @method changeTabName - Changes the current tab name.
 * @param {string} tabName - The new tab name.
 * @method toggleDrawer - Toggles the visibility of the drawer.
 */
@Component({
  selector: 'app-user-mobile-header',
  templateUrl: './user-mobile-header.component.html',
})
export class UserMobileHeaderComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  public currentRoute: string = '/home-page';
  public tabName: string = 'Konta';
  public user: UserAccount = new UserAccount();
  constructor(
    router: Router,
    userService: UserService,
    private appInformationStatesService: AppInformationStatesService,
    protected avatarService: AvatarService
  ) {
    this.currentRoute = router.url;
    this.user = userService.userAccount;
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
