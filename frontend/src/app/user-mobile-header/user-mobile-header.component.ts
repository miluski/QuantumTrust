import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

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
