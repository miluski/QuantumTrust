import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { VerificationService } from '../../services/verification.service';
import { WindowEventsService } from '../../services/window-events.service';
import { Account } from '../../types/account';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-guest-open-account',
  templateUrl: './guest-open-account.component.html',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    MatDividerModule,
  ],
  standalone: true,
})
export class GuestOpenAccountComponent {
  canShake: boolean = false;
  userAccountFlags: UserAccountFlags = new UserAccountFlags();
  userAccount: UserAccount = new UserAccount();
  account: Account = new Account();
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
    this.userAccountFlags.isEmailValid = this.verificationService.validateEmail(
      this.userAccount.email
    );
    this.userAccountFlags.isPhoneNumberValid =
      this.verificationService.validatePhoneNumber(
        String(this.userAccount.phoneNumber)
      );
    this.userAccountFlags.isNameValid =
      this.verificationService.validateFirstName(this.userAccount.name);
    this.userAccountFlags.isSurnameValid =
      this.verificationService.validateLastName(this.userAccount.surname);
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
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.userAccountFlags.isRepeatedPasswordValid =
      this.verificationService.validateRepeatedPassword(
        this.userAccount.repeatedPassword,
        this.userAccount.password
      );
    this.userAccountFlags.isAccountCurrencyValid =
      this.verificationService.validateAccountCurrency(
        this.account.currency as string
      );
    this.userAccountFlags.isAccountTypeValid =
      this.verificationService.validateAccountType(this.account.type);
    this.setCanShake();
  }
  private setCanShake(): void {
    this.canShake =
      this.userAccountFlags.isEmailValid === false ||
      this.userAccountFlags.isPhoneNumberValid === false ||
      this.userAccountFlags.isNameValid === false ||
      this.userAccountFlags.isSurnameValid === false ||
      this.userAccountFlags.isPeselValid === false ||
      this.userAccountFlags.isIdentityDocumentTypeValid === false ||
      this.userAccountFlags.isIdentityDocumentSerieValid === false ||
      this.userAccountFlags.isAddressValid === false ||
      this.userAccountFlags.isRepeatedPasswordValid === false ||
      this.userAccountFlags.isPasswordValid === false ||
      this.userAccountFlags.isAccountCurrencyValid === false ||
      this.userAccountFlags.isAccountTypeValid === false;
  }
}
