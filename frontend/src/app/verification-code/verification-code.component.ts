import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { VerificationService } from '../../services/verification.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ShakeStateService } from '../../services/shake-state.service';

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
    private appInformationStatesService: AppInformationStatesService
  ) {}
  handleButtonClick(): void {
    this.isVerificationCodeValid =
      this.verificationService.validateVerificationCode(this.verificationCode);
    if (!this.isVerificationCodeValid) {
      this.shakeStateService.setCurrentShakeState(
        !this.isVerificationCodeValid
      );
    } else {
      (this.actionType === 'Otwieranie konta' &&
        this.router.url !== '/main-page') ||
      this.actionType === 'Logowanie'
        ? this.router.navigateByUrl(this.buttonLink)
        : this.changeTabName('Finanse');
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
  private changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
}
