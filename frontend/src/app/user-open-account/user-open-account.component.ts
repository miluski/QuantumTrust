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

/**
 * @fileoverview UserOpenAccountComponent is a standalone Angular component that allows users to open a new account.
 * It includes functionality for verifying account data and managing the current tab name.
 * 
 * @component
 * @selector app-user-open-account
 * @templateUrl ./user-open-account.component.html
 * @animations AnimationsProvider.animations
 * @imports CommonModule, MatDividerModule, FormsModule, VerificationCodeComponent
 * 
 * @class UserOpenAccountComponent
 * 
 * @property {Account} account - The account information being created.
 * @property {UserAccountFlags} userAccountFlags - Flags indicating the validity of the account data.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 * 
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - The service managing application state information.
 * @param {VerificationService} verificationService - The service providing data verification methods.
 * 
 * @method changeTabName - Changes the current tab name.
 * @param {string} tabName - The new tab name.
 * @method verifyData - Verifies the account data.
 * @method setCanShake - Sets the shake state based on the validity of the account data.
 */
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
  public account: Account = new Account();
  public userAccountFlags: UserAccountFlags = new UserAccountFlags();
  public shakeStateService: ShakeStateService = new ShakeStateService();
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
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid ? 'shake' : 'none');
  }
}
