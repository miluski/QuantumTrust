import { Component } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

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
    const isUserNotExists: boolean = await this.userService.getIsUserNotExists(
      this.userAccount
    );
    if (isSomeDataInvalid === false && isUserNotExists) {
      this.userService.operation = 'register';
      this.userService.sendVerificationEmail(this.userAccount.emailAddress);
      this.userService.setRegisteringUserAccount(this.userAccount);
      this.userService.setOpeningBankAccount(this.account);
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
}
