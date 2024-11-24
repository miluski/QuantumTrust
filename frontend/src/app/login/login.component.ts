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
 * @component LoginComponent
 * @description This component is responsible for managing the login process for users.
 *
 * @selector app-login
 * @templateUrl ./login.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class LoginComponent
 *
 * @property {UserAccount} userAccount - The user account object containing user details.
 * @property {UserAccountFlags} userAccountFlags - Flags indicating the validation status of user account fields.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {UserService} userService - Service to manage user data.
 * @param {CryptoService} cryptoService - Service to handle data encryption.
 * @param {HttpClient} httpClient - The Angular HTTP client for making HTTP requests.
 * @param {AlertService} alertService - Service to manage alerts.
 *
 * @method verifyData - Verifies the user data by setting validation flags and checking if the user exists.
 * @method getIsUserExists - Checks if the user exists by making an HTTP request.
 * @method showAlert - Shows an alert indicating that the login data is invalid.
 * @method setCanShake - Sets the shake state based on the validation flags and user existence.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [AnimationsProvider.animations],
})
export class LoginComponent {
  public userAccount: UserAccount;
  public userAccountFlags: UserAccountFlags;
  public shakeStateService: ShakeStateService;

  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private httpClient: HttpClient,
    protected alertService: AlertService
  ) {
    this.userAccount = new UserAccount();
    this.userAccountFlags = new UserAccountFlags();
    this.shakeStateService = new ShakeStateService();
  }

  public verifyData(): void {
    this.userAccountFlags.isIdentifierValid =
      this.verificationService.validateIdentifier(this.userAccount.id);
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.setCanShake();
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
}
