import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-user-open-account',
  templateUrl: './user-open-account.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    VerificationCodeComponent,
    CommonModule,
    MatDividerModule,
    FormsModule,
  ],
  standalone: true,
})
export class UserOpenAccountComponent {
  protected account: Account = new Account();
  protected userAccountFlags: UserAccountFlags = new UserAccountFlags();
  protected shakeStateService: ShakeStateService = new ShakeStateService();
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
    const isSomeDataInvalid: boolean =
      this.userAccountFlags.isAccountCurrencyValid === false ||
      this.userAccountFlags.isAccountTypeValid === false;
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
  }
}
