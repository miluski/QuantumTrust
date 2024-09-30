import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component GuestHeaderComponent
 * @description
 * This component represents the header for guest users. It includes functionality to manage the current route and tab name, 
 * and provides methods to change the tab name and toggle a drawer.
 * 
 * @selector app-guest-header
 * @templateUrl ./guest-header.component.html
 * @imports [CommonModule, RouterModule, MatIconModule]
 * @standalone true
 * 
 * @class GuestHeaderComponent
 * @implements OnInit
 * 
 * @property {string} currentRoute - The current route of the application.
 * @property {string} tabName - The name of the current tab.
 * 
 * @constructor
 * @param {Router} router - The Angular Router service.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * 
 * @method ngOnInit
 * @description
 * Lifecycle hook that is called after the component's view has been fully initialized. Subscribes to the currentTabName 
 * observable to update the tabName property.
 * 
 * @method changeTabName
 * @param {string} tabName - The new tab name to set.
 * @description
 * Changes the current tab name by calling the changeTabName method of the AppInformationStatesService.
 * 
 * @method toggleDrawer
 * @description
 * Toggles the drawer by calling the toggleDrawer method of the AppInformationStatesService.
 */
@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
})
export class GuestHeaderComponent implements OnInit {
  public currentRoute: string = '/home-page';
  public tabName: string = 'Konta';
  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
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
}
