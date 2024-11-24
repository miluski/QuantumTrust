import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { UserService } from '../../services/user.service';
import { allowedTabNames } from '../../utils/allowed-tab-names';

/**
 * @component MainPageComponent
 * @description This component is responsible for displaying and managing the main page of the application.
 *
 * @selector app-main-page
 * @templateUrl ./main-page.component.html
 *
 * @class MainPageComponent
 * @implements OnInit, OnDestroy
 *
 * @property {string} tabName - The name of the current tab.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ChangeDetectorRef} changeDetectorRef - Service to detect changes.
 * @param {UserService} userService - Service to manage user data.
 * @param {Router} router - The Angular Router service for navigation.
 * @param {AlertService} alertService - Service to manage alerts.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTabName observable and resets timers.
 * @method ngOnDestroy - Lifecycle hook that cleans up the component. Clears the timers.
 * @method onUserActivity - Handles user activity events to reset timers.
 * @method resetTimers - Resets the inactivity and logout timers.
 * @method clearTimers - Clears the inactivity and logout timers.
 * @method showInactivityAlert - Shows an alert indicating user inactivity.
 * @method logoutUser - Logs out the user due to inactivity and shows an alert.
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent implements OnInit, OnDestroy {
  public tabName: string;

  private logoutTimer!: any;
  private inactivityTimer!: any;

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private router: Router,
    protected alertService: AlertService
  ) {
    this.tabName = 'Finanse';
    this.appInformationStatesService.changeTabName(this.tabName);
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  public onUserActivity(): void {
    this.resetTimers();
  }

  public ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => {
        this.tabName = currentTabName;
        if (allowedTabNames.includes(currentTabName)) {
          this.userService.refreshUserObjects();
        }
        this.changeDetectorRef.detectChanges();
      }
    );

    this.resetTimers();
  }

  public ngOnDestroy(): void {
    this.clearTimers();
  }

  private resetTimers(): void {
    this.clearTimers();
    this.inactivityTimer = setTimeout(() => {
      this.showInactivityAlert();
    }, 3 * 60 * 1000);
    this.logoutTimer = setTimeout(() => {
      this.logoutUser();
    }, 5 * 60 * 1000);
  }

  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  private showInactivityAlert(): void {
    this.alertService.alertContent =
      'Twoja nieaktywność wynosi 3 minuty. Proszę wykonać jakąkolwiek akcję w ciągu następnych 2 minut, aby uniknąć automatycznego wylogowania.';
    this.alertService.alertIcon = 'fa-circle-exclamation';
    this.alertService.alertTitle = 'Ostrzeżenie';
    this.alertService.alertType = 'warning';
    this.alertService.progressBarBorderColor = '#fde047';
    this.alertService.show();
    this.userService.refreshTokens();
  }

  private logoutUser(): void {
    this.alertService.alertContent =
      'Nastąpiło automatyczne wylogowanie z powodu nieaktywności';
    this.alertService.alertIcon = 'fa-circle-exclamation';
    this.alertService.alertTitle = 'Ostrzeżenie';
    this.alertService.alertType = 'warning';
    this.alertService.progressBarBorderColor = '#fde047';
    this.alertService.show();
    this.userService.logout();
    this.appInformationStatesService.changeTabName('Konta');
    this.router.navigate(['/home-page']);
  }
}
