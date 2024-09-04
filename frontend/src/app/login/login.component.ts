import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { VerificationService } from '../../services/verification.service';
import { WindowEventsService } from '../../services/window-events.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  standalone: true,
})
export class LoginComponent implements OnInit {
  currentSite: number = 1;
  canShake: boolean = false;
  userAccountFlags: UserAccountFlags = new UserAccountFlags();
  userAccount: UserAccount = new UserAccount();
  constructor(
    private windowEventsService: WindowEventsService,
    private verificationService: VerificationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.currentSite = 1;
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
  changeCurrentSite(): void {
    this.currentSite = 2;
  }
  verifyData(): void {
    if (this.currentSite === 1) {
      this.userAccountFlags.isIdentifierValid =
        this.verificationService.validateIdentifier(
          this.userAccount.identifier
        );
      this.userAccountFlags.isPasswordValid =
        this.verificationService.validatePassword(this.userAccount.password);
    } else {
      this.userAccountFlags.isVerificationCodeValid =
        this.verificationService.validateVerificationCode(
          this.userAccount.verificationCode
        );
    }
    this.setCanShake();
  }
  redirectToMainPage(): void {
    this.router.navigate(['/main-page']);
  }
  private setCanShake(): void {
    this.canShake =
      this.userAccountFlags.isIdentifierValid === false ||
      this.userAccountFlags.isPasswordValid === false ||
      (this.currentSite === 2 &&
        this.userAccountFlags.isVerificationCodeValid === false);
  }
}
