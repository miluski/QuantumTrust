import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { CryptoService } from '../../services/crypto.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * LoginComponent is responsible for handling the login process.
 * It includes form validation and state management for user account data.
 *
 * @component
 * @selector 'app-login'
 * @templateUrl './login.component.html'
 * @animations [AnimationsProvider.animations]
 *
 * @class LoginComponent
 *
 * @method verifyData Verifies the user data by validating the identifier and password fields.
 * @method setCanShake Sets the shake state based on the validation flags.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [AnimationsProvider.animations],
})
export class LoginComponent {
  public shakeStateService: ShakeStateService = new ShakeStateService();
  public userAccountFlags: UserAccountFlags = new UserAccountFlags();
  public userAccount: UserAccount = new UserAccount();

  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private httpClient: HttpClient,
    protected alertService: AlertService
  ) {}

  verifyData(): void {
    this.userAccountFlags.isIdentifierValid =
      this.verificationService.validateIdentifier(this.userAccount.id);
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.setCanShake();
  }

  private async setCanShake(): Promise<void> {
    const isSomeDataInvalid: boolean =
      this.userAccountFlags.isIdentifierValid === false ||
      this.userAccountFlags.isPasswordValid === false;
    const isUserExists: boolean = await this.getIsUserExists();
    if (isSomeDataInvalid === false && isUserExists) {
      this.userService.operation = 'login';
      this.userService.sendVerificationEmail(this.userAccount.id.toString());
      this.userService.setLoggingUserAccount(this.userAccount);
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid || !isUserExists ? 'shake' : 'none'
    );
  }

  private getIsUserExists(): Promise<boolean> {
    const encryptedId: string = this.cryptoService.encryptData(
      this.userAccount.id
    );
    const encodedId: string = encodeURIComponent(encryptedId);
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/id?id=${encodedId}`,
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: (response) => resolve(response.status === 200),
        error: () => {
          this.showAlert();
          resolve(false);
        },
      });
    });
  }

  private showAlert(): void {
    this.alertService.alertContent = 'Podane dane logowania są nieprawidłowe.';
    this.alertService.alertIcon = 'fa-circle-xmark';
    this.alertService.alertTitle = 'Błąd';
    this.alertService.alertType = 'error';
    this.alertService.progressBarBorderColor = '#fca5a5';
    this.alertService.show();
  }
}
