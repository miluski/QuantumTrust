import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * @component UnauthorizedComponent
 * @description This component is responsible for displaying an unauthorized access page and redirecting the user to the home page.
 *
 * @selector app-unauthorized
 * @templateUrl ./unauthorized.component.html
 *
 * @class UnauthorizedComponent
 * @implements OnInit
 *
 * @property {boolean} isDrawerOpened - Flag indicating if the drawer is opened.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AlertService} alertService - Service to manage alerts.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentIsDrawerOpened observable and sets a timeout to redirect the user to the home page.
 */
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent implements OnInit {
  public isDrawerOpened: boolean;

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private router: Router,
    protected alertService: AlertService
  ) {
    this.isDrawerOpened = false;
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
    setTimeout(() => {
      this.appInformationStatesService.changeTabName('Konta');
      this.router.navigate(['/home-page']);
    }, 1000);
  }
}
