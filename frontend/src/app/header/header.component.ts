import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { GuestHeaderComponent } from '../guest-header/guest-header.component';
import { GuestMobileHeaderComponent } from '../guest-mobile-header/guest-mobile-header.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { UserMobileHeaderComponent } from '../user-mobile-header/user-mobile-header.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterModule,
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
  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
  }
  changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }
  isGuestPart(): boolean {
    return (
      this.currentRoute === '' ||
      this.currentRoute === '/home-page' ||
      this.currentRoute === '/login' ||
      this.currentRoute === '/open-account' ||
      this.currentRoute === '/single-account' ||
      this.currentRoute === '/single-deposit' ||
      this.currentRoute === '/single-card'
    );
  }
}
