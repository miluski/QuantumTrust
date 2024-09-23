import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { UserAccount } from '../../types/user-account';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
})
export class UserHeaderComponent implements OnInit {
  currentRoute: string = '/main-page';
  tabName: string = 'Finanse';
  isMenuVisible: boolean = false;
  user: UserAccount;
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
}
