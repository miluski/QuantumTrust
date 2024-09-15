import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
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
  avatarError: boolean = false;
  user: UserAccount;
  avatarColor: string;
  constructor(
    router: Router,
    userService: UserService,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
    this.user = userService.userAccount;
    this.avatarColor = this.getRandomColor();
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
  getInitials(): string {
    const initials = this.user.name.charAt(0) + this.user.surname.charAt(0);
    return initials.toUpperCase();
  }
  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
