import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { VerificationService } from '../verification.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-open-account',
  templateUrl: './open-account.component.html',
  styleUrl: './open-account.component.css',
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
export class OpenAccountComponent {
  isEmailValid!: boolean;
  isPhoneNumberValid!: boolean;
  isNameValid!: boolean;
  isSurnameValid!: boolean;
  isPeselValid!: boolean;
  isIdentifyDocumentTypeValid!: boolean;
  isIdentifyDocumentSerieValid!: boolean;
  isAddressValid!: boolean;
  isPasswordValid!: boolean;
  isRepeatedPasswordValid!: boolean;
  isAccountTypeValid!: boolean;
  isAccountCurrencyValid!: boolean;
  canShake: boolean = false;
  email!: string;
  phoneNumber!: string;
  name!: string;
  surname!: string;
  pesel!: number;
  identifyDocumentType: string = 'Dowód Osobisty';
  accountType: string = 'Konto osobiste';
  accountCurrency: string = 'PLN';
  identifyDocumentSerie!: string;
  address!: string;
  password!: string;
  repeatedPassword!: string;
  constructor(
    private windowEventsService: WindowEventsService,
    private verificationService: VerificationService
  ) {}
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
  verifyData(): void {
    this.isEmailValid = this.verificationService.validateEmail(this.email);
    this.isPhoneNumberValid = this.verificationService.validatePhoneNumber(
      this.phoneNumber
    );
    this.isNameValid = this.verificationService.validateFirstName(this.name);
    this.isSurnameValid = this.verificationService.validateLastName(
      this.surname
    );
    this.isPeselValid = this.verificationService.validatePESEL(this.pesel);
    this.isIdentifyDocumentTypeValid =
      this.verificationService.validateIdentityDocumentType(
        this.identifyDocumentType
      );
    this.isIdentifyDocumentSerieValid =
      this.verificationService.validateDocument(this.identifyDocumentSerie);
    this.isAddressValid = this.verificationService.validateAddress(
      this.address
    );
    this.isPasswordValid = this.verificationService.validatePassword(
      this.password
    );
    this.isRepeatedPasswordValid =
      this.verificationService.validateRepeatedPassword(
        this.repeatedPassword,
        this.password
      );
    this.isAccountCurrencyValid =
      this.verificationService.validateAccountCurrency(this.accountCurrency);
    this.isAccountTypeValid = this.verificationService.validateAccountType(
      this.accountType
    );
    this.setCanShake();
  }
  private setCanShake(): void {
    this.canShake =
      this.isEmailValid === false ||
      this.isPhoneNumberValid === false ||
      this.isNameValid === false ||
      this.isSurnameValid === false ||
      this.isPeselValid === false ||
      this.isIdentifyDocumentTypeValid === false ||
      this.isIdentifyDocumentSerieValid === false ||
      this.isAddressValid === false ||
      this.isRepeatedPasswordValid === false ||
      this.isPasswordValid === false ||
      this.isAccountCurrencyValid === false ||
      this.isAccountTypeValid === false;
  }
}
