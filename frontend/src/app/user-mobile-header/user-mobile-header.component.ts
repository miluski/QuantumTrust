import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { UserAccount } from '../../types/user-account';

@Component({
  selector: 'app-user-mobile-header',
  templateUrl: './user-mobile-header.component.html',
  imports: [CommonModule, RouterModule, MatDrawer],
  standalone: true,
})
export class UserMobileHeaderComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  currentRoute: string = '/home-page';
  tabName: string = 'Konta';
  avatarError: boolean = false;
  user: UserAccount = new UserAccount();
  avatarColor: string;
  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
    this.user.name = 'Maksymilian';
    this.user.surname = 'Sowula';
    this.avatarColor = this.getRandomColor();
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
  getInitials(): string {
    const initials = this.user.name.charAt(0) + this.user.surname.charAt(0);
    return initials.toUpperCase();
  }
  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
