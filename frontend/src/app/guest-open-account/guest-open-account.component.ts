import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { CryptoService } from '../../services/crypto.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * @component GuestOpenAccountComponent
 * @description This component is responsible for managing the account opening process for guest users.
 *
 * @selector app-guest-open-account
 * @templateUrl ./guest-open-account.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class GuestOpenAccountComponent
 *
 * @property {Account} account - The account object containing account details.
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
 * @method setIsContactDataValid - Sets the validation flags for contact data.
 * @method setIsFullNameValid - Sets the validation flags for full name.
 * @method setIsIdentityDataValid - Sets the validation flags for identity data.
 * @method setIsPasswordValid - Sets the validation flags for password.
 * @method setIsAccountDataValid - Sets the validation flags for account data.
 * @method setCanShake - Sets the shake state based on the validation flags and user existence.
 * @method getIsUserNotExists - Checks if the user does not exist by making an HTTP request.
 * @method showAlert - Shows an alert indicating that the user already exists.
 * @method showUnexpectedErrorAlert - Shows an alert indicating an unexpected error.
 */
@Component({
  selector: 'app-guest-open-account',
  templateUrl: './guest-open-account.component.html',
  animations: [AnimationsProvider.animations],
})
export class GuestOpenAccountComponent {
  public account: Account;
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
    this.account = new Account();
    this.account.currency = 'PLN';
    this.account.type = 'personal';
    this.userAccount = new UserAccount();
    this.userAccount.documentType = 'Dowód Osobisty';
    this.userAccountFlags = new UserAccountFlags();
    this.shakeStateService = new ShakeStateService();
  }

  public verifyData(): void {
    this.setIsContactDataValid();
    this.setIsAccountDataValid();
    this.setIsFullNameValid();
    this.setIsIdentityDataValid();
    this.setIsPasswordValid();
    this.setCanShake();
  }

  private setIsContactDataValid(): void {
    this.userAccountFlags.isEmailValid = this.verificationService.validateEmail(
      this.userAccount.emailAddress
    );
    this.userAccountFlags.isPhoneNumberValid =
      this.verificationService.validatePhoneNumber(
        String(this.userAccount.phoneNumber)
      );
  }

  private setIsFullNameValid(): void {
    this.userAccountFlags.isNameValid =
      this.verificationService.validateFirstName(this.userAccount.firstName);
    this.userAccountFlags.isSurnameValid =
      this.verificationService.validateLastName(this.userAccount.lastName);
  }

  private setIsIdentityDataValid(): void {
    this.userAccountFlags.isPeselValid = this.verificationService.validatePESEL(
      this.userAccount.peselNumber as number
    );
    this.userAccountFlags.isIdentityDocumentTypeValid =
      this.verificationService.validateIdentityDocumentType(
        this.userAccount.documentType
      );
    this.userAccountFlags.isIdentityDocumentSerieValid =
      this.verificationService.validateDocument(this.userAccount.documentSerie);
    this.userAccountFlags.isAddressValid =
      this.verificationService.validateAddress(this.userAccount.address);
  }

  private setIsPasswordValid(): void {
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.userAccountFlags.isRepeatedPasswordValid =
      this.verificationService.validateRepeatedPassword(
        this.userAccount.repeatedPassword,
        this.userAccount.password
      );
  }

  private setIsAccountDataValid(): void {
    this.userAccountFlags.isAccountCurrencyValid =
      this.verificationService.validateAccountCurrency(
        this.account.currency as string
      );
    this.userAccountFlags.isAccountTypeValid =
      this.verificationService.validateAccountType(this.account.type);
  }

  private async setCanShake(): Promise<void> {
    const isSomeDataInvalid: boolean = this.validationFlags.some(
      (flag: boolean) => flag === false
    );
    const isUserNotExists: boolean = await this.getIsUserNotExists();
    if (isSomeDataInvalid === false && isUserNotExists) {
      this.userService.operation = 'register';
      this.userService.sendVerificationEmail(this.userAccount.emailAddress);
      this.userService.setRegisteringUserAccount(this.userAccount);
      this.userService.setRegisteringAccount(this.account);
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid || isUserNotExists === false ? 'shake' : 'none'
    );
  }

  private get validationFlags(): boolean[] {
    return [
      this.userAccountFlags.isEmailValid,
      this.userAccountFlags.isPhoneNumberValid,
      this.userAccountFlags.isNameValid,
      this.userAccountFlags.isSurnameValid,
      this.userAccountFlags.isPeselValid,
      this.userAccountFlags.isIdentityDocumentTypeValid,
      this.userAccountFlags.isIdentityDocumentSerieValid,
      this.userAccountFlags.isAddressValid,
      this.userAccountFlags.isRepeatedPasswordValid,
      this.userAccountFlags.isPasswordValid,
      this.userAccountFlags.isAccountCurrencyValid,
      this.userAccountFlags.isAccountTypeValid,
    ];
  }

  private getIsUserNotExists(): Promise<boolean> {
    const encryptedEmail: string = this.cryptoService.encryptData(
      this.userAccount.emailAddress
    );
    const encodedEmail: string = encodeURIComponent(encryptedEmail);
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/user/email?email=${encodedEmail}`,
      { observe: 'response' }
    );
    return new Promise((resolve) => {
      request.subscribe({
        next: () => {
          this.showAlert();
          resolve(false);
        },
        error: (response: HttpErrorResponse) => {
          if (response.status !== 404) {
            this.showUnexpectedErrorAlert();
          }
          resolve(response.status === 404);
        },
      });
    });
  }

  private showAlert(): void {
    this.alertService.alertContent =
      'Użytkownik o podanym adresie email już istnieje.';
    this.alertService.alertIcon = 'fa-circle-xmark';
    this.alertService.alertTitle = 'Błąd';
    this.alertService.alertType = 'error';
    this.alertService.progressBarBorderColor = '#fca5a5';
    this.alertService.show();
  }

  private showUnexpectedErrorAlert(): void {
    this.alertService.alertContent = 'Wystąpił nieoczekiwany problem.';
    this.alertService.alertIcon = 'fa-circle-exclamation';
    this.alertService.alertTitle = 'Ostrzeżenie';
    this.alertService.alertType = 'warning';
    this.alertService.progressBarBorderColor = '#fde047';
    this.alertService.show();
  }
}
