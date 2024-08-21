import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { VerificationService } from '../verification.service';
import { WindowEventsService } from '../window-events.service';

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
  isIdentifierValid!: boolean;
  isPasswordValid!: boolean;
  isVerificationCodeValid!: boolean;
  identifier!: number;
  password!: string;
  verificationCode!: number;
  constructor(
    private windowEventsService: WindowEventsService,
    private verificationService: VerificationService
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
  changeIdentifier(identifier: number): void {
    this.identifier = identifier;
  }
  changePassword(password: string): void {
    this.password = password;
  }
  changeVerificationCode(verificationCode: number): void {
    this.verificationCode = verificationCode;
  }
  verifyData(): void {
    if (this.currentSite === 1) {
      this.isIdentifierValid = this.verificationService.validateIdentifier(
        this.identifier
      );
      this.isPasswordValid = this.verificationService.validatePassword(
        this.password
      );
    } else {
      this.isVerificationCodeValid =
        this.verificationService.validateVerificationCode(
          this.verificationCode
        );
    }
  }
}
