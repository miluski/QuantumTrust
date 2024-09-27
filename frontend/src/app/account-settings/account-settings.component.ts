import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';
import { ShakeStateService } from '../../services/shake-state.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  animations: [AnimationsProvider.animations],
  imports: [VerificationCodeComponent, CommonModule, FormsModule],
  standalone: true,
})
export class AccountSettingsComponent implements OnInit {
  protected isNotDataChanged!: boolean;
  protected userObject: UserAccount;
  protected actualPassword: string = '';
  protected avatarUrl: string = '';
  protected avatarError: string = '';
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  protected userAccountFlags: UserAccountFlags = new UserAccountFlags();
  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.userObject = JSON.parse(JSON.stringify(userService.userAccount));
  }
  ngOnInit(): void {
    this.avatarService.currentTemporaryAvatarUrl.subscribe(
      (avatarUrl: string) => (this.avatarUrl = avatarUrl)
    );
  }
  onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const avatar: Blob = input.files[0];
      this.userAccountFlags.isAvatarValid = this.isAvatarValid(avatar);
      this.userAccountFlags.isAvatarValid ? this.changeAvatarUrl(avatar) : null;
    }
  }
  handleSaveButtonClick(): void {
    const isSomeDataInvalid: boolean = this.validationFlags.some(
      (flag: boolean) => flag === false
    );
    this.isNotDataChanged = !this.isSomeDataNotEqualWithOriginal;
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid || this.isNotDataChanged);
  }
  validateName(): void {
    if (this.userObject.name !== this.userService.userAccount.name) {
      this.userAccountFlags.isNameValid =
        this.verificationService.validateFirstName(this.userObject.name);
    }
  }
  validateSurname(): void {
    if (this.userObject.surname !== this.userService.userAccount.surname) {
      this.userAccountFlags.isSurnameValid =
        this.verificationService.validateLastName(this.userObject.surname);
    }
  }
  validateEmail(): void {
    if (this.userObject.email !== this.userService.userAccount.email) {
      this.userAccountFlags.isEmailValid =
        this.verificationService.validateEmail(this.userObject.email);
    }
  }
  validatePhoneNumber(): void {
    if (
      this.userObject.phoneNumber !== this.userService.userAccount.phoneNumber
    ) {
      this.userAccountFlags.isPhoneNumberValid =
        this.verificationService.validatePhoneNumber(
          String(this.userObject.phoneNumber)
        );
    }
  }
  validateAddress(): void {
    if (this.userObject.address !== this.userService.userAccount.address) {
      this.userAccountFlags.isAddressValid =
        this.verificationService.validateAddress(this.userObject.address);
    }
  }
  validatePassword(): void {
    if (this.actualPassword !== '') {
      this.userAccountFlags.isPasswordValid =
        this.verificationService.validatePassword(this.actualPassword) &&
        this.userObject.password === this.actualPassword;
    }
  }
  validateRepeatedPassword(): void {
    if (this.actualPassword !== '') {
      this.userAccountFlags.isRepeatedPasswordValid =
        this.verificationService.validateRepeatedPassword(
          this.userObject.repeatedPassword,
          this.actualPassword
        );
    }
  }
  private isAvatarValid(avatar: Blob): boolean {
    const isTypeValid: boolean =
      this.verificationService.validateSelectedAvatarType(avatar);
    const isSizeValid: boolean =
      this.verificationService.validateSelectedAvatarSize(avatar);
    this.avatarError =
      isTypeValid === false
        ? 'Wybrany typ pliku jest nieprawidłowy.'
        : isSizeValid === false
        ? 'Rozmiar pliku jest za duży.'
        : '';
    return isTypeValid && isSizeValid;
  }
  private changeAvatarUrl(avatar: Blob): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.avatarService.setTemporaryAvatarUrl(
        (e.target as FileReader).result as string
      );
      this.avatarService.setTemporaryAvatarError(false);
    };
    reader.readAsDataURL(avatar);
  }
  private get isSomeDataNotEqualWithOriginal(): boolean {
    return (
      this.userObject.name !== this.userService.userAccount.name ||
      this.userObject.surname !== this.userService.userAccount.surname ||
      this.userObject.email !== this.userService.userAccount.email ||
      this.userObject.phoneNumber !==
        this.userService.userAccount.phoneNumber ||
      this.userObject.address !== this.userService.userAccount.address ||
      this.actualPassword !== ''
    );
  }
  private get validationFlags(): boolean[] {
    return [
      this.userAccountFlags.isEmailValid,
      this.userAccountFlags.isPhoneNumberValid,
      this.userAccountFlags.isNameValid,
      this.userAccountFlags.isSurnameValid,
      this.userAccountFlags.isAddressValid,
      this.userAccountFlags.isRepeatedPasswordValid,
      this.userAccountFlags.isPasswordValid,
      this.userAccountFlags.isAvatarValid,
    ];
  }
}
