import { Component } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
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
      this.userAccount.peselNumber
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
  private setCanShake(): void {
    const isSomeDataInvalid: boolean = this.validationFlags.some(
      (flag: boolean) => flag === false
    );
    if (isSomeDataInvalid === false) {
      this.userService.operation = 'register';
      this.userService.sendVerificationEmail(this.userAccount.emailAddress);
      this.userService.setRegisteringUserAccount(this.userAccount);
      this.userService.setRegisteringAccount(this.account);
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
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
}
