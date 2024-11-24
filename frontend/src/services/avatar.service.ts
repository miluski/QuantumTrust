import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

/**
 * @class AvatarService
 * @description This service is responsible for managing user avatars, including temporary avatar URLs and avatar errors.
 *
 * @providedIn 'root'
 *
 * @property {BehaviorSubject<string>} temporaryAvatarUrl - The temporary avatar URL.
 * @property {BehaviorSubject<boolean>} temporaryAvatarError - The temporary avatar error state.
 * @property {string} avatarColor - The color of the avatar.
 * @property {boolean} avatarError - The avatar error state.
 * @property {Observable<boolean>} currentAvatarError - Observable for the current avatar error state.
 * @property {Observable<string>} currentTemporaryAvatarUrl - Observable for the current temporary avatar URL.
 *
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 *
 * @method setTemporaryAvatarUrl - Sets the temporary avatar URL.
 * @param {string} temporaryAvatarUrl - The temporary avatar URL to be set.
 * @method setTemporaryAvatarError - Sets the temporary avatar error state.
 * @param {boolean} avatarError - The avatar error state to be set.
 * @method getInitials - Gets the initials of the user based on their first and last name.
 * @returns {string} - Returns the initials of the user.
 * @method actualAvatarError - Getter method to get the current avatar error state.
 * @returns {boolean} - Returns the current avatar error state.
 * @method getRandomColor - Generates a random color for the avatar.
 * @returns {string} - Returns a random color.
 */
@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private temporaryAvatarUrl: BehaviorSubject<string>;
  private temporaryAvatarError: BehaviorSubject<boolean>;

  public avatarColor: string;
  public avatarError: boolean = false;
  public currentAvatarError: Observable<boolean>;
  public currentTemporaryAvatarUrl: Observable<string>;

  constructor(private userService: UserService) {
    this.avatarError = false;
    this.temporaryAvatarUrl = new BehaviorSubject('');
    this.temporaryAvatarError = new BehaviorSubject(false);
    this.currentAvatarError = this.temporaryAvatarError.asObservable();
    this.currentTemporaryAvatarUrl = this.temporaryAvatarUrl.asObservable();
    this.avatarColor = this.getRandomColor();
  }

  public setTemporaryAvatarUrl(temporaryAvatarUrl: string): void {
    this.temporaryAvatarUrl.next(temporaryAvatarUrl);
  }

  public setTemporaryAvatarError(avatarError: boolean): void {
    this.temporaryAvatarError.next(avatarError);
  }

  public getInitials(): string {
    const firstNameInitial =
      this.userService.userAccount.firstName?.charAt(0) || '';
    const lastNameInitial =
      this.userService.userAccount.lastName?.charAt(0) || '';
    const initials: string = (firstNameInitial + lastNameInitial).toUpperCase();
    return initials;
  }

  public get actualAvatarError(): boolean {
    return this.temporaryAvatarError.getValue();
  }

  private getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
