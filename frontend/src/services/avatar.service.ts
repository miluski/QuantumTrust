import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccount } from '../types/user-account';
import { UserService } from './user.service';

/**
 * @fileoverview AvatarService manages the avatar URL and color for the user account.
 * It provides functionalities to set temporary avatar URLs and handle avatar errors.
 * It also generates a random color for the avatar.
 *
 * @service
 * @providedIn root
 *
 * @class AvatarService
 * @property {BehaviorSubject<string>} temporaryAvatarUrl - The temporary avatar URL.
 * @property {BehaviorSubject<boolean>} temporaryAvatarError - The error state of the temporary avatar.
 * @property {UserAccount} user - The user account information.
 * @property {string} avatarColor - The color of the avatar.
 * @property {boolean} avatarError - Indicates whether there is an error with the avatar.
 * @property {Observable<string>} currentTemporaryAvatarUrl - Observable for the temporary avatar URL.
 * @property {Observable<boolean>} currentAvatarError - Observable for the temporary avatar error state.
 *
 * @method setTemporaryAvatarUrl - Sets the temporary avatar URL.
 * @method setTemporaryAvatarError - Sets the error state of the temporary avatar.
 * @method getRandomColor - Generates a random color for the avatar.
 *
 * @constructor
 * @param {UserService} userService - Service for managing user account information.
 */
@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private temporaryAvatarUrl: BehaviorSubject<string> = new BehaviorSubject('');
  private temporaryAvatarError: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  protected user: UserAccount;
  public avatarColor: string;
  public avatarError: boolean = false;
  public currentTemporaryAvatarUrl: Observable<string> =
    this.temporaryAvatarUrl.asObservable();
  public currentAvatarError: Observable<boolean> =
    this.temporaryAvatarError.asObservable();
  constructor(userService: UserService) {
    this.user = userService.userAccount;
    this.avatarColor = this.getRandomColor();
  }
  setTemporaryAvatarUrl(temporaryAvatarUrl: string): void {
    this.temporaryAvatarUrl.next(temporaryAvatarUrl);
  }
  setTemporaryAvatarError(avatarError: boolean): void {
    this.temporaryAvatarError.next(avatarError);
  }
  get actualAvatarError(): boolean {
    return this.temporaryAvatarError.getValue();
  }
  getInitials(): string {
    const initials = this.user.name.charAt(0) + this.user.surname.charAt(0);
    return initials.toUpperCase();
  }
  private getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
