import { Component } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * @component UserOpenAccountComponent
 * @description This component is responsible for managing the process of opening a new account for authenticated users.
 *
 * @selector app-user-open-account
 * @templateUrl ./user-open-account.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class UserOpenAccountComponent
 *
 * @property {Account} account - The account object containing account details.
 * @property {UserAccountFlags} userAccountFlags - Flags indicating the validation status of user account fields.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 *
 * @method changeTabName - Changes the current tab name using the appInformationStatesService.
 * @param {string} tabName - The new tab name to be set.
 * @method verifyData - Verifies the user data by setting validation flags.
 * @method setCanShake - Sets the shake state based on the validation flags.
 */
@Component({
  selector: 'app-user-open-account',
  templateUrl: './user-open-account.component.html',
  animations: [AnimationsProvider.animations],
})
export class UserOpenAccountComponent {
  public account: Account;
  public userAccountFlags: UserAccountFlags;
  public shakeStateService: ShakeStateService;

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private verificationService: VerificationService,
    private userService: UserService
  ) {
    this.account = new Account();
    this.account.type = 'personal';
    this.account.currency = 'PLN';
    this.userAccountFlags = new UserAccountFlags();
    this.shakeStateService = new ShakeStateService();
  }

  public changeTabName(tabName: string): void {
    this.appInformationStatesService.changeTabName(tabName);
  }

  public verifyData(): void {
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
    if (isSomeDataInvalid === false) {
      this.userService.operation = 'logged-user-open-account';
      this.userService.setOpeningBankAccount(this.account);
      this.userService.sendVerificationEmail(
        'otworzenie nowego konta bankowego'
      );
    }
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }
}
