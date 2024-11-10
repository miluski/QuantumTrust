import { Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * Component representing an unauthorized access page.
 *
 * @selector app-unauthorized
 * @templateUrl ./unauthorized.component.html
 *
 * @class UnauthorizedComponent
 * @implements OnInit
 *
 * @property {boolean} isDrawerOpened - Indicates whether the drawer is opened.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 *
 * @method ngOnInit
 * @description Initializes the component and subscribes to the drawer state changes.
 */
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent implements OnInit {
  public isDrawerOpened: boolean = false;
  constructor(
    private appInformationStatesService: AppInformationStatesService
  ) {}
  ngOnInit(): void {
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}
