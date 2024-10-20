import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';

/**
 * MainPageComponent is the main component for the application's main page.
 * It includes various sub-components and manages the state of the current tab name.
 *
 * @selector 'app-main-page'
 * @templateUrl './main-page.component.html'
 *
 * @class MainPageComponent
 * @implements OnInit
 *
 * @method ngOnInit Initializes the component and subscribes to the currentTabName observable.
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent implements OnInit {
  public tabName: string = 'Finanse';
  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private changeDetectorRef: ChangeDetectorRef,
    protected alertService: AlertService
  ) {
    this.appInformationStatesService.changeTabName(this.tabName);
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => {
        this.tabName = currentTabName;
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
