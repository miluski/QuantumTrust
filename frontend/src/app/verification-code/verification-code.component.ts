import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDividerModule,
    HeaderComponent,
    FooterComponent,
    CustomAlertComponent,
  ],
  animations: [AnimationsProvider.animations],
  standalone: true,
})
export class VerificationCodeComponent {
  @Input() actionType!: string;
  protected verificationCode!: number;
  protected isVerificationCodeValid!: boolean;
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private appInformationStatesService: AppInformationStatesService,
    private alertService: AlertService
  ) {}
  handleButtonClick(): void {
    this.isVerificationCodeValid =
      this.verificationService.validateVerificationCode(this.verificationCode);
    if (!this.isVerificationCodeValid) {
      this.shakeStateService.setCurrentShakeState(true);
      return;
    }
    const isOpeningAccount = this.actionType === 'Otwieranie konta';
    const isLoggingIn = this.actionType === 'Logowanie';
    const isNotOnMainPage = this.router.url !== '/main-page';
    if ((isOpeningAccount && isNotOnMainPage) || isLoggingIn) {
      this.alertService.progressValue = 100;
      this.setAlertCredentials('info', 'Sukces!', 'positive');
      this.alertService.show();
      this.router.navigateByUrl(this.buttonLink);
    } else {
      this.alertService.progressValue = 100;
      this.setAlertCredentials('info', 'Sukces!', 'positive');
      this.alertService.show();
      this.changeTabName('Finanse');
    }
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
  private setAlertCredentials(
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
  private changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
}
