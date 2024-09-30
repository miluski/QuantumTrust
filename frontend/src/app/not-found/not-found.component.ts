import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

/**
 * NotFoundComponent is a standalone Angular component that displays a "not found" page.
 * It includes a header and footer and subscribes to the drawer state from the AppInformationStatesService.
 *
 * @selector 'app-not-found'
 * @templateUrl './not-found.component.html'
 * @imports [HeaderComponent, FooterComponent, CommonModule]
 *
 * @class NotFoundComponent
 * @implements OnInit
 *
 * @property {boolean} isDrawerOpened - Indicates whether the drawer is opened.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to get the current drawer state.
 *
 * @method ngOnInit - Lifecycle hook that is called after the component's view has been initialized.
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  standalone: true,
})
export class NotFoundComponent implements OnInit {
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
