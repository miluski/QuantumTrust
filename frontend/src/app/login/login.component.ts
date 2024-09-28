import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    HeaderComponent,
    FooterComponent,
    VerificationCodeComponent,
    CustomAlertComponent,
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  standalone: true,
})
export class LoginComponent {
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  protected userAccountFlags: UserAccountFlags = new UserAccountFlags();
  protected userAccount: UserAccount = new UserAccount();
  constructor(
    private verificationService: VerificationService,
    protected alertService: AlertService
  ) {}
  verifyData(): void {
    this.userAccountFlags.isIdentifierValid =
      this.verificationService.validateIdentifier(this.userAccount.identifier);
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.setCanShake();
  }
  private setCanShake(): void {
    const isSomeDataInvalid: boolean =
      this.userAccountFlags.isIdentifierValid === false ||
      this.userAccountFlags.isPasswordValid === false;
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
  }
}
