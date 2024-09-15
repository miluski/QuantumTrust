import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccountFlags } from '../../types/user-account-flags';

@Component({
  selector: 'app-user-open-account',
  templateUrl: './user-open-account.component.html',
  imports: [CommonModule, MatDividerModule, FormsModule],
  standalone: true,
})
export class UserOpenAccountComponent {
  canShake: boolean = false;
  userAccountFlags: UserAccountFlags = new UserAccountFlags();
  account: Account = new Account();
  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private verificationService: VerificationService
  ) {
    this.account.type = 'Konto osobiste';
    this.account.currency = 'PLN';
  }
  changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }
  verifyData(): void {
    this.userAccountFlags.isAccountCurrencyValid =
      this.verificationService.validateAccountCurrency(
        this.account.currency as string
      );
    this.userAccountFlags.isAccountTypeValid =
      this.verificationService.validateAccountType(this.account.type);
    this.setCanShake();
  }
  private setCanShake(): void {
    this.canShake =
      this.userAccountFlags.isAccountCurrencyValid === false ||
      this.userAccountFlags.isAccountTypeValid === false;
  }
}
