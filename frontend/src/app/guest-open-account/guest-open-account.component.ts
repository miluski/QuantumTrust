import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { WindowEventsService } from '../../services/window-events.service';
import { Account } from '../../types/account';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-guest-open-account',
  templateUrl: './guest-open-account.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    HeaderComponent,
    FooterComponent,
    VerificationCodeComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    MatDividerModule,
  ],
  standalone: true,
})
export class GuestOpenAccountComponent {
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  protected userAccountFlags: UserAccountFlags = new UserAccountFlags();
  protected userAccount: UserAccount = new UserAccount();
  protected account: Account = new Account();
  constructor(
    private windowEventsService: WindowEventsService,
    private verificationService: VerificationService
  ) {
    this.userAccount.identityDocumentType = 'Dowód Osobisty';
    this.account.type = 'Konto osobiste';
    this.account.currency = 'PLN';
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
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
      this.userAccount.email
    );
    this.userAccountFlags.isPhoneNumberValid =
      this.verificationService.validatePhoneNumber(
        String(this.userAccount.phoneNumber)
      );
  }
  private setIsFullNameValid(): void {
    this.userAccountFlags.isNameValid =
      this.verificationService.validateFirstName(this.userAccount.name);
    this.userAccountFlags.isSurnameValid =
      this.verificationService.validateLastName(this.userAccount.surname);
  }
  private setIsIdentityDataValid(): void {
    this.userAccountFlags.isPeselValid = this.verificationService.validatePESEL(
      this.userAccount.pesel
    );
    this.userAccountFlags.isIdentityDocumentTypeValid =
      this.verificationService.validateIdentityDocumentType(
        this.userAccount.identityDocumentType
      );
    this.userAccountFlags.isIdentityDocumentSerieValid =
      this.verificationService.validateDocument(
        this.userAccount.identityDocumentSerie
      );
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
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
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
