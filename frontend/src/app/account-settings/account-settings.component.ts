import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AvatarService } from '../../services/avatar.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * @component AccountSettingsComponent
 * @description This component is responsible for managing user account settings, including avatar, personal information, and password.
 *
 * @selector app-account-settings
 * @templateUrl ./account-settings.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class AccountSettingsComponent
 * @implements OnInit
 *
 * @property {string} avatarUrl - The URL of the user's avatar.
 * @property {string} avatarError - Error message related to avatar upload.
 * @property {string} actualPassword - The current password of the user.
 * @property {UserAccount} userObject - The user account object containing user details.
 * @property {boolean} isNotDataChanged - Flag indicating if the data has not been changed.
 * @property {UserAccountFlags} userAccountFlags - Flags indicating the validation status of user account fields.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {UserService} userService - Service to manage user data.
 * @param {AvatarService} avatarService - Service to manage user avatar.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentTemporaryAvatarUrl observable.
 * @method onFileSelected - Handles the file selection event for avatar upload.
 * @param {Event} event - The file selection event.
 * @method handleSaveButtonClick - Handles the save button click event.
 * @method validateName - Validates the user's first name.
 * @method validateSurname - Validates the user's last name.
 * @method validateEmail - Validates the user's email address.
 * @method validatePhoneNumber - Validates the user's phone number.
 * @method validateAddress - Validates the user's address.
 * @method validatePassword - Validates the user's current password.
 * @method validateNewPassword - Validates the user's new password.
 * @method changeAvatarUrl - Changes the user's avatar URL.
 * @param {Blob} avatar - The new avatar file.
 * @method isSomeDataNotEqualWithOriginal - Checks if some data is not equal to the original data.
 * @returns {boolean} - Returns true if some data is not equal to the original data, otherwise false.
 * @method validationFlags - Gets the validation flags for the user account fields.
 * @returns {boolean[]} - Returns an array of validation flags.
 * @method isAvatarValid - Checks if the avatar is valid.
 * @param {Blob} avatar - The avatar file to be checked.
 * @returns {boolean} - Returns true if the avatar is valid, otherwise false.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  animations: [AnimationsProvider.animations],
})
export class AccountSettingsComponent implements OnInit {
  public avatarUrl: string;
  public avatarError: string;
  public newPassword: string;
  public userObject: UserAccount;
  public isNotDataChanged!: boolean;
  public userAccountFlags: UserAccountFlags;
  public shakeStateService: ShakeStateService;

  constructor(
    private verificationService: VerificationService,
    private userService: UserService,
    protected avatarService: AvatarService
  ) {
    this.userObject = { ...userService.userAccount };
    this.avatarUrl = '';
    this.avatarError = '';
    this.newPassword = '';
    this.userAccountFlags = new UserAccountFlags();
    this.shakeStateService = new ShakeStateService();
  }

  public ngOnInit(): void {
    this.avatarService.currentTemporaryAvatarUrl.subscribe(
      (avatarUrl: string) => {
        this.avatarUrl = avatarUrl;
      }
    );
  }

  public onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const avatar: Blob = input.files[0];
      this.userAccountFlags.isAvatarValid = this.isAvatarValid(avatar);
      this.userAccountFlags.isAvatarValid ? this.changeAvatarUrl(avatar) : null;
    }
  }

  public handleSaveButtonClick(): void {
    const isSomeDataInvalid: boolean = this.validationFlags.some(
      (flag: boolean) => flag === false
    );
    this.isNotDataChanged = !this.isSomeDataNotEqualWithOriginal;
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid || this.isNotDataChanged ? 'shake' : 'none'
    );
  }

  public validateName(): void {
    this.userAccountFlags.isNameValid =
      this.verificationService.validateFirstName(this.userObject.firstName);
  }

  public validateSurname(): void {
    this.userAccountFlags.isSurnameValid =
      this.verificationService.validateLastName(this.userObject.lastName);
  }

  public validateEmail(): void {
    this.userAccountFlags.isEmailValid = this.verificationService.validateEmail(
      this.userObject.emailAddress
    );
  }

  public validatePhoneNumber(): void {
    this.userAccountFlags.isPhoneNumberValid =
      this.verificationService.validatePhoneNumber(
        String(this.userObject.phoneNumber)
      );
  }

  public validateAddress(): void {
    this.userAccountFlags.isAddressValid =
      this.verificationService.validateAddress(this.userObject.address);
  }

  public validateNewPassword(): void {
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.newPassword);
    this.validateRepeatedPassword();
  }

  public validateRepeatedPassword(): void {
    this.userAccountFlags.isRepeatedPasswordValid =
      this.verificationService.validatePassword(
        this.userObject.repeatedPassword
      ) && this.userObject.repeatedPassword === this.newPassword;
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

  public get isSomeDataNotEqualWithOriginal(): boolean {
    return (
      this.userObject.firstName !== this.userService.userAccount.firstName ||
      this.userObject.lastName !== this.userService.userAccount.lastName ||
      this.userObject.emailAddress !==
        this.userService.userAccount.emailAddress ||
      this.userObject.phoneNumber !==
        this.userService.userAccount.phoneNumber ||
      this.userObject.address !== this.userService.userAccount.address ||
      this.newPassword !== '' ||
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
}
