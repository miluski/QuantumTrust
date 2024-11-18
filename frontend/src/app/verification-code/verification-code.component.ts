import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';

/**
 * @fileoverview VerificationCodeComponent handles the verification code input and validation process.
 * It provides various functionalities based on the action type such as logging in, opening an account, etc.
 * It also manages the display of alerts and navigation based on the verification result.
 *
 * @component
 * @selector app-verification-code
 * @templateUrl ./verification-code.component.html
 * @animations AnimationsProvider.animations
 *
 * @class VerificationCodeComponent
 * @property {string} actionType - The type of action being performed (e.g., 'Logowanie', 'Otwieranie konta').
 * @property {number} verificationCode - The verification code input by the user.
 * @property {boolean} isVerificationCodeValid - Indicates whether the verification code is valid.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @method handleButtonClick - Handles the button click event, validates the verification code, and performs actions based on the result.
 * @method handleRedirectButtonClick - Handles the redirect button click event and changes the tab name if necessary.
 * @method redirectText - Returns the text for the redirect button based on the action type.
 * @method redirectLink - Returns the link for the redirect button based on the action type.
 * @method buttonText - Returns the text for the main button based on the action type.
 * @method ask - Returns the question text based on the action type.
 * @method buttonLink - Returns the link for the main button based on the action type.
 * @method setAlertCredentials - Sets the alert credentials (type, title, content) based on the action type and trigger type.
 * @method changeTabName - Changes the tab name using the AppInformationStatesService.
 *
 * @constructor
 * @param {Router} router - Angular Router service for navigation.
 * @param {VerificationService} verificationService - Service for verifying the verification code.
 * @param {AppInformationStatesService} appInformationStatesService - Service for managing application state information.
 * @param {AlertService} alertService - Service for managing alerts.
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
  public shakeStateService: ShakeStateService = new ShakeStateService();

  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private appInformationStatesService: AppInformationStatesService,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  handleButtonClick(): void {
    this.validateVerificationCode();
    const isOpeningAccount = this.actionType === 'Otwieranie konta';
    const isLoggingIn = this.actionType === 'Logowanie';
    const isNotOnMainPage = this.router.url !== '/main-page';
    const isUserLoggedIn: boolean =
      !((isOpeningAccount && isNotOnMainPage) || isLoggingIn);
    if (this.isVerificationCodeValid) {
      const isOperationFinalized: boolean =
        this.userService.finalizeOperation();
      isOperationFinalized
        ? this.showPositiveAlert(isUserLoggedIn)
        : this.showNegativeAlert();
    } else {
      this.showNegativeAlert();
    }
  }

  validateVerificationCode(): void {
    this.isVerificationCodeValid =
      this.verificationService.validateVerificationCode(
        this.verificationCode
      ) && this.userService.getIsCodeValid(this.verificationCode.toString());
    if (!this.isVerificationCodeValid) {
      this.shakeStateService.setCurrentShakeState('shake');
    }
  }

  showPositiveAlert(isUserLoggedIn: boolean): void {
    this.alertService.progressValue = 100;
    this.setAlertCredentials('info', 'Sukces!', 'positive');
    this.alertService.show();
    isUserLoggedIn
      ? this.changeTabName('Finanse')
      : this.router.navigateByUrl(this.buttonLink);
  }

  showNegativeAlert(): void {
    this.alertService.progressValue = 100;
    this.setAlertCredentials('error', 'Błąd!', 'negative');
    this.alertService.show();
  }

  handleRedirectButtonClick(): void {
    this.actionType === 'Logowanie' ||
    (this.actionType === 'Otwieranie konta' && this.router.url !== '/main-page')
      ? null
      : this.changeTabName('Finanse');
  }

  get redirectText(): string {
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

  get redirectLink(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return '/open-account';
      case 'Otwieranie konta':
        return this.router.url === '/main-page' ? '/main-page' : '/login';
      default:
        return '/main-page';
    }
  }

  get buttonText(): string {
    switch (this.actionType) {
      case 'Logowanie':
        return 'Zaloguj się';
      case 'Otwieranie konta':
        return 'Otwórz konto';
      default:
        return 'Zatwierdź';
    }
  }

  get ask(): string {
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

  public setAlertCredentials(
    alertType: 'info' | 'warning' | 'error',
    alertTitle: string,
    triggerType: 'positive' | 'negative'
  ): void {
    this.alertService.alertType = alertType;
    this.alertService.alertTitle = alertTitle;
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

  public changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
}
