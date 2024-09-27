import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

@Component({
  selector: 'app-user-mobile-header',
  templateUrl: './user-mobile-header.component.html',
  imports: [CommonModule, RouterModule, MatDrawer],
  standalone: true,
})
export class UserMobileHeaderComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  protected currentRoute: string = '/home-page';
  protected tabName: string = 'Konta';
  protected user: UserAccount = new UserAccount();
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
