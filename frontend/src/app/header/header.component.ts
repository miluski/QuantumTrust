import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { GuestHeaderComponent } from '../guest-header/guest-header.component';
import { GuestMobileHeaderComponent } from '../guest-mobile-header/guest-mobile-header.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { UserMobileHeaderComponent } from '../user-mobile-header/user-mobile-header.component';

/**
 * HeaderComponent is responsible for displaying the appropriate header based on the current route and tab name.
 * It includes methods for changing the tab name and determining if the current route is part of the guest section.
 *
 * @component
 * @selector 'app-header'
 * @templateUrl './header.component.html'
 * @styleUrls ['./header.component.css']
 * @imports [
 *   RouterModule,
 *   GuestMobileHeaderComponent,
 *   GuestHeaderComponent,
 *   UserMobileHeaderComponent,
 *   UserHeaderComponent,
 * ]
 * @standalone true
 *
 * @method ngOnInit Initializes the component and subscribes to the currentTabName observable.
 * @method changeTabName Changes the current tab name using the AppInformationStatesService.
 * @method isGuestPart Determines if the current route is part of the guest section.
 */
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
  public tabName!: string;
  public currentRoute!: string;
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
    return this.currentRoute !== '/main-page';
  }
}
