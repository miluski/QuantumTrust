import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';

/**
 * @component VerificationCodeComponent
 * @description This component is responsible for managing the verification code process for various user actions.
 *
 * @selector app-verification-code
 * @templateUrl ./verification-code.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class VerificationCodeComponent
 *
 * @property {string} actionType - The type of action being verified (e.g., 'Logowanie', 'Otwieranie konta').
 * @property {number} verificationCode - The verification code entered by the user.
 * @property {boolean} isVerificationCodeValid - Flag indicating if the verification code is valid.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {AlertService} alertService - Service to manage alerts.
 * @param {UserService} userService - Service to manage user data.
 *
 * @method validateVerificationCode - Validates the verification code entered by the user.
 * @method showPositiveAlert - Shows a positive alert indicating successful verification.
 * @param {boolean} isUserLoggedIn - Flag indicating if the user is logged in.
 * @method showNegativeAlert - Shows a negative alert indicating failed verification.
 * @method setAlertCredentials - Sets the credentials for the alert based on the action type and trigger type.
 * @param {'info' | 'warning' | 'error'} alertType - The type of alert.
 * @param {string} alertTitle - The title of the alert.
 * @param {string} alertIcon - The icon of the alert.
 * @param {string} progressBarBorderColor - The border color of the progress bar.
 * @param {'positive' | 'negative'} triggerType - The trigger type of the alert.
 * @method handleRedirectButtonClick - Handles the redirect button click event.
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method handleButtonClick - Handles the button click event to validate the verification code and finalize the operation.
 * @returns {Promise<void>} - Returns a promise that resolves when the operation is finalized.
 * @method redirectText - Getter method to get the redirect text based on the action type.
 * @returns {string} - Returns the redirect text.
 * @method redirectLink - Getter method to get the redirect link based on the action type.
 * @returns {string} - Returns the redirect link.
 * @method buttonText - Getter method to get the button text based on the action type.
 * @returns {string} - Returns the button text.
 * @method ask - Getter method to get the ask text based on the action type.
 * @returns {string} - Returns the ask text.
 * @method buttonLink - Getter method to get the button link based on the action type.
 * @returns {string} - Returns the button link.
 */
@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  animations: [AnimationsProvider.animations],
})
export class VerificationCodeComponent {
  @Input() actionType!: string;

  public verificationCode!: number;
  public isVerificationCodeValid!: boolean;
  public shakeStateService: ShakeStateService;

  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private appInformationStatesService: AppInformationStatesService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.shakeStateService = new ShakeStateService();
  }

  public validateVerificationCode(): void {
    this.isVerificationCodeValid =
      this.verificationService.validateVerificationCode(
        this.verificationCode
      ) && this.userService.getIsCodeValid(this.verificationCode.toString());
    if (!this.isVerificationCodeValid) {
      this.shakeStateService.setCurrentShakeState('shake');
    }
  }

  public showPositiveAlert(isUserLoggedIn: boolean): void {
    this.alertService.progressValue = 100;
    this.setAlertCredentials(
      'info',
      'Sukces!',
      'fa-circle-info',
      '#276749',
      'positive'
    );
    this.alertService.show();
    isUserLoggedIn
      ? this.changeTabName('Finanse')
      : setTimeout(() => this.router.navigateByUrl(this.buttonLink), 500);
  }

  public showNegativeAlert(isUserLoggedIn: boolean): void {
    this.alertService.progressValue = 100;
    this.setAlertCredentials(
      'error',
      'Błąd!',
      'fa-circle-xmark',
      '#fca5a5',
      'negative'
    );
    this.alertService.show();
    isUserLoggedIn
      ? this.changeTabName('Finanse')
      : setTimeout(() => this.userService.logout(), 500);
  }

  public setAlertCredentials(
    alertType: 'info' | 'warning' | 'error',
    alertTitle: string,
    alertIcon: string,
    progressBarBorderColor: string,
    triggerType: 'positive' | 'negative'
  ): void {
    this.alertService.alertType = alertType;
    this.alertService.alertTitle = alertTitle;
    this.alertService.progressBarBorderColor = progressBarBorderColor;
    this.alertService.alertIcon = alertIcon;
    switch (this.actionType) {
      case 'Logowanie':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie zalogowano!'
            : 'Wystąpił błąd przy próbie zalogowania się!';
        break;
      case 'Otwieranie konta':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie otworzono nowe konto!'
            : 'Wystąpił błąd przy próbie otworzenia konta!';
        break;
      case 'Zmiana ustawień konta':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie zmieniono wybrane ustawienie konta!'
            : 'Wystąpił błąd przy próbie zmiany ustawień konta!';
        break;
      case 'Wyrób nowej karty':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie wyrobiono nową kartę!'
            : 'Wystąpił błąd przy próbie wyrobienia nowej karty!';
        break;
      case 'Otwieranie lokaty':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie otworzono nową lokatę!'
            : 'Wystąpił błąd przy próbie otworzenia nowej lokaty!';
        break;
      case 'Zmiana ustawień karty':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie zmieniono wybrane ustawienie karty!'
            : 'Wystąpił błąd przy próbie zmiany ustawień karty!';
        break;
      case 'Potwierdzenie przelewu':
        this.alertService.alertContent =
          triggerType === 'positive'
            ? 'Pomyślnie wysłano przelew!'
            : 'Wystąpił błąd przy próbie wysłania przelewu!';
        break;
      default:
        this.alertService.alertContent = '';
        break;
    }
  }

  public handleRedirectButtonClick(): void {
    this.actionType === 'Logowanie' ||
    (this.actionType === 'Otwieranie konta' && this.router.url !== '/main-page')
      ? null
      : this.changeTabName('Finanse');
  }

  public changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public get redirectText(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return 'Załóż je!';
      case 'Otwieranie konta':
        return this.router.url === '/main-page'
          ? 'Powrót do finansów!'
          : 'Zaloguj się!';
      default:
        return 'Powrót do finansów!';
    }
  }

  public get redirectLink(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return '/open-account';
      case 'Otwieranie konta':
        return this.router.url === '/main-page' ? '/main-page' : '/login';
      default:
        return '/main-page';
    }
  }

  public get buttonText(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return 'Zaloguj się';
      case 'Otwieranie konta':
        return 'Otwórz konto';
      default:
        return 'Zatwierdź';
    }
  }

  public get ask(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return 'Nie masz konta?';
      case 'Otwieranie konta':
        return this.router.url === '/main-page'
          ? 'Zabłądziłeś?'
          : 'Masz już konto?';
      default:
        return 'Zabłądziłeś?';
    }
  }

  public async handleButtonClick(): Promise<void> {
    this.validateVerificationCode();
    const isOpeningAccount = this.actionType === 'Otwieranie konta';
    const isLoggingIn = this.actionType === 'Logowanie';
    const isNotOnMainPage = this.router.url !== '/main-page';
    const isUserLoggedIn: boolean = !(
      (isOpeningAccount && isNotOnMainPage) ||
      isLoggingIn
    );
    if (this.isVerificationCodeValid) {
      const isOperationFinalized: boolean =
        await this.userService.finalizeOperation();
      isOperationFinalized
        ? this.showPositiveAlert(isUserLoggedIn)
        : this.showNegativeAlert(isUserLoggedIn);
    } else {
      this.showNegativeAlert(isUserLoggedIn);
    }
  }

  private get buttonLink(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return '/main-page';
      case 'Otwieranie konta':
        return this.router.url === '/main-page' ? '/main-page' : '/login';
      default:
        return '/main-page';
    }
  }
}
