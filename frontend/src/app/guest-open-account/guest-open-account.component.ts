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
 * GuestOpenAccountComponent is responsible for handling the guest account opening process.
 * It includes form validation and state management for user account data.
 *
 * @component
 * @selector 'app-guest-open-account'
 * @templateUrl './guest-open-account.component.html'
 * @animations [AnimationsProvider.animations]
 *
 * @method verifyData Verifies the user data by validating various fields and setting the shake state.
 * @method setIsContactDataValid Validates the contact data (email and phone number) of the user account.
 * @method setIsFullNameValid Validates the full name (first name and last name) of the user account.
 * @method setIsIdentityDataValid Validates the identity data (PESEL, document type, document series, and address) of the user account.
 * @method setIsPasswordValid Validates the password and repeated password of the user account.
 * @method setIsAccountDataValid Validates the account data (currency and type) of the user account.
 * @method setCanShake Sets the shake state based on the validation flags.
 * @method get validationFlags Returns an array of validation flags for the user account data.
 */
@Component({
  selector: 'app-guest-open-account',
  templateUrl: './guest-open-account.component.html',
  animations: [AnimationsProvider.animations],
})
export class GuestOpenAccountComponent {
  public shakeStateService: ShakeStateService = new ShakeStateService();
  public userAccountFlags: UserAccountFlags = new UserAccountFlags();
  public userAccount: UserAccount = new UserAccount();
  public account: Account = new Account();

  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private httpClient: HttpClient,
    protected alertService: AlertService
  ) {
    this.userAccount.documentType = 'Dowód Osobisty';
    this.account.type = 'Konto osobiste';
    this.account.currency = 'PLN';
  }

  verifyData(): void {
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
