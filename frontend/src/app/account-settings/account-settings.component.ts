import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AvatarService } from '../../services/avatar.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * @fileoverview AccountSettingsComponent is responsible for managing user account settings.
 * It includes functionalities for validating and updating user information such as name, surname, email, phone number, address, and password.
 * It also handles avatar selection and validation.
 *
 * @component
 * @selector app-account-settings
 * @templateUrl ./account-settings.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class AccountSettingsComponent
 * @implements OnInit
 *
 * @property {boolean} isNotDataChanged - Indicates if the data has not been changed.
 * @property {UserAccount} userObject - Stores the user account information.
 * @property {string} actualPassword - Stores the actual password.
 * @property {string} avatarUrl - Stores the URL of the avatar.
 * @property {string} avatarError - Stores the error message related to avatar validation.
 * @property {ShakeStateService} shakeStateService - Service to manage shake state.
 * @property {UserAccountFlags} userAccountFlags - Flags to indicate the validity of user account fields.
 *
 * @constructor
 * @param {VerificationService} verificationService - Service for verification operations.
 * @param {UserService} userService - Service to manage user data.
 * @param {AvatarService} avatarService - Service to manage avatar operations.
 *
 * @method ngOnInit - Initializes the component and subscribes to avatar URL changes.
 * @method onFileSelected - Handles the file selection event for avatar upload.
 * @method handleSaveButtonClick - Handles the save button click event and validates the data.
 * @method validateName - Validates the user's first name.
 * @method validateSurname - Validates the user's surname.
 * @method validateEmail - Validates the user's email.
 * @method validatePhoneNumber - Validates the user's phone number.
 * @method validateAddress - Validates the user's address.
 * @method validatePassword - Validates the user's password.
 * @method validateRepeatedPassword - Validates the repeated password.
 * @method isAvatarValid - Validates the selected avatar.
 * @method changeAvatarUrl - Changes the avatar URL.
 * @method isSomeDataNotEqualWithOriginal - Checks if some data is not equal to the original data.
 * @method validationFlags - Returns an array of validation flags.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  animations: [AnimationsProvider.animations],
})
export class AccountSettingsComponent implements OnInit {
  public isNotDataChanged!: boolean;
  public userObject: UserAccount;
  public actualPassword: string = '';
  public avatarUrl: string = '';
  public avatarError: string = '';
  public shakeStateService: ShakeStateService = new ShakeStateService();
  public userAccountFlags: UserAccountFlags = new UserAccountFlags();
  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.userObject = { ...userService.userAccount };
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
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid || this.isNotDataChanged ? 'shake' : 'none'
    );
  }
  validateName(): void {
    if (this.userObject.firstName !== this.userService.userAccount.firstName) {
      this.userAccountFlags.isNameValid =
        this.verificationService.validateFirstName(this.userObject.firstName);
    }
  }
  validateSurname(): void {
    if (this.userObject.lastName !== this.userService.userAccount.lastName) {
      this.userAccountFlags.isSurnameValid =
        this.verificationService.validateLastName(this.userObject.lastName);
    }
  }
  validateEmail(): void {
    if (
      this.userObject.emailAddress !== this.userService.userAccount.emailAddress
    ) {
      this.userAccountFlags.isEmailValid =
        this.verificationService.validateEmail(this.userObject.emailAddress);
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
  validateNewPassword(): void {
    if (this.actualPassword !== '') {
      this.userAccountFlags.isRepeatedPasswordValid =
        this.verificationService.validatePassword(
          this.userObject.repeatedPassword
        );
    }
  }
  public changeAvatarUrl(avatar: Blob): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.avatarService.setTemporaryAvatarUrl(
        (e.target as FileReader).result as string
      );
      this.avatarService.setTemporaryAvatarError(false);
    };
    reader.readAsDataURL(avatar);
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
  public get isSomeDataNotEqualWithOriginal(): boolean {
    return (
      this.userObject.firstName !== this.userService.userAccount.firstName ||
      this.userObject.lastName !== this.userService.userAccount.lastName ||
      this.userObject.emailAddress !==
        this.userService.userAccount.emailAddress ||
      this.userObject.phoneNumber !==
        this.userService.userAccount.phoneNumber ||
      this.userObject.address !== this.userService.userAccount.address ||
      this.actualPassword !== '' ||
      this.userAccountFlags.isAvatarValid === true
    );
  }
  public get validationFlags(): boolean[] {
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
