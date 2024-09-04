import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { HeaderStateService } from '../../services/header-state.service';
import { GuestHeaderComponent } from '../guest-header/guest-header.component';
import { GuestMobileHeaderComponent } from '../guest-mobile-header/guest-mobile-header.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { UserMobileHeaderComponent } from '../user-mobile-header/user-mobile-header.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    CommonModule,
    RouterModule,
    HomePageComponent,
    GuestMobileHeaderComponent,
    GuestHeaderComponent,
    UserMobileHeaderComponent,
    UserHeaderComponent,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  tabName!: string;
  currentRoute!: string;

  constructor(router: Router, private headerStateService: HeaderStateService) {
    this.currentRoute = router.url;
  }

  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
  }

  changeTabName(tabName: string): void {
    this.headerStateService.changeTabName(tabName);
  }

  isGuestPart(): boolean {
    return (
      this.currentRoute === '/home-page' ||
      this.currentRoute === '/login' ||
      this.currentRoute === '/open-account' ||
      this.currentRoute === '/single-account' ||
      this.currentRoute === '/single-deposit' ||
      this.currentRoute === '/single-card'
    );
  }
}
