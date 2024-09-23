import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccount } from '../types/user-account';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private temporaryAvatarUrl: BehaviorSubject<string> = new BehaviorSubject('');
  private temporaryAvatarError: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  user: UserAccount;
  avatarColor: string;
  avatarError: boolean = false;
  currentTemporaryAvatarUrl: Observable<string> =
    this.temporaryAvatarUrl.asObservable();
  currentAvatarError: Observable<boolean> =
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
