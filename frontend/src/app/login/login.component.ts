import { Component } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AlertService } from '../../services/alert.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { VerificationService } from '../../services/verification.service';
import { UserAccount } from '../../types/user-account';
import { UserAccountFlags } from '../../types/user-account-flags';

/**
 * LoginComponent is responsible for handling the login process.
 * It includes form validation and state management for user account data.
 *
 * @component
 * @selector 'app-login'
 * @templateUrl './login.component.html'
 * @animations [AnimationsProvider.animations]
 *
 * @class LoginComponent
 *
 * @method verifyData Verifies the user data by validating the identifier and password fields.
 * @method setCanShake Sets the shake state based on the validation flags.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [AnimationsProvider.animations],
})
export class LoginComponent {
  public shakeStateService: ShakeStateService = new ShakeStateService();
  public userAccountFlags: UserAccountFlags = new UserAccountFlags();
  public userAccount: UserAccount = new UserAccount();
  constructor(
    private verificationService: VerificationService,
    protected alertService: AlertService
  ) {}
  verifyData(): void {
    this.userAccountFlags.isIdentifierValid =
      this.verificationService.validateIdentifier(this.userAccount.identifier);
    this.userAccountFlags.isPasswordValid =
      this.verificationService.validatePassword(this.userAccount.password);
    this.setCanShake();
  }
  private setCanShake(): void {
    const isSomeDataInvalid: boolean =
      this.userAccountFlags.isIdentifierValid === false ||
      this.userAccountFlags.isPasswordValid === false;
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }
}
