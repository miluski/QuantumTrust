import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component HeaderComponent
 * @description This component is responsible for displaying and managing the header section of the application.
 *
 * @selector app-header
 * @templateUrl ./header.component.html
 * @styleUrls ['./header.component.css']
 *
 * @class HeaderComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} currentRoute - The current route URL.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method isGuestPart - Determines if the current route is not the main page.
 * @returns {boolean} - Returns true if the current route is not the main page, otherwise false.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
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

  public ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
  }
  public changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public isGuestPart(): boolean {
    return this.currentRoute !== '/main-page';
  }
}
