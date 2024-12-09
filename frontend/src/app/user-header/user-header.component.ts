import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
})
export class UserHeaderComponent implements OnInit {
  private currentAvatarUrl: string;

  public tabName: string;
  public currentRoute: string;
  public isMenuVisible: boolean;

  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService,
    private cdr: ChangeDetectorRef,
    protected userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.currentAvatarUrl = '';
    this.tabName = 'Finanse';
    this.currentRoute = '/main-page';
    this.isMenuVisible = false;
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
