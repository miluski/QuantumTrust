import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class AccountSettingsComponent implements OnInit {
  protected userObject: UserAccount;
  protected actualPassword: string = '';
  protected avatarUrl: string = '';
  constructor(
    private verificationService: VerificationService,
    protected avatarService: AvatarService,
    userService: UserService
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
      const isAvatarValid = this.isAvatarValid(avatar);
      isAvatarValid ? this.changeAvatarUrl(avatar) : null;
    }
  }
  private isAvatarValid(avatar: Blob): boolean {
    const isTypeValid: boolean =
      this.verificationService.validateSelectedAvatarType(avatar);
    const isSizeValid: boolean =
      this.verificationService.validateSelectedAvatarSize(avatar);
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
}
