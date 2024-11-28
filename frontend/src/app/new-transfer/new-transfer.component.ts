import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { TransferFlags } from '../../types/transfer-flags';

/**
 * @component NewTransferComponent
 * @description This component is responsible for managing the new transfer process for users.
 *
 * @selector app-new-transfer
 * @templateUrl ./new-transfer.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class NewTransferComponent
 * @implements OnInit
 *
 * @property {Account[]} userAccounts - Array of user accounts.
 * @property {string} transferTitle - The title of the transfer.
 * @property {number} transferAmount - The amount of the transfer.
 * @property {TransferFlags} transferFlags - Flags indicating the validation status of transfer fields.
 * @property {string} transferReceiverAccountId - The ID of the receiver's account.
 * @property {ShakeStateService} shakeStateService - Service to manage the shake state of the component.
 *
 * @constructor
 * @param {UserService} userService - Service to manage user data.
 * @param {VerificationService} verificationService - Service to handle verification of user data.
 * @param {ConvertService} convertService - Service to handle data conversion.
 * @param {PaginationService} paginationService - Service to manage pagination.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method handleButtonClick - Handles the button click event to validate fields and set the shake state.
 * @method setUserAccounts - Sets the user accounts and initializes pagination.
 * @method validateFields - Validates the transfer fields.
 * @method currentSelectedAccount - Getter method to get the current selected account.
 * @method currentTransferAmount - Getter method to get the current transfer amount.
 * @method setIsTransferAmountValid - Sets the validation flag for the transfer amount.
 * @method setIsTransferTitleValid - Sets the validation flag for the transfer title.
 * @method setsTransferReceiverAccountNumberValid - Sets the validation flag for the receiver's account number.
 * @method actualTransferFlagsArray - Getter method to get the array of transfer validation flags.
 * @returns {boolean[]} - Returns an array of transfer validation flags.
 */
@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.component.html',
  animations: [AnimationsProvider.animations],
})
export class NewTransferComponent implements OnInit {
  private userAccounts!: Account[];

  public transferTitle!: string;
  public transferAmount: number;
  public transferFlags: TransferFlags;
  public transferReceiverAccountId!: string;
  public shakeStateService: ShakeStateService;

  constructor(
    private userService: UserService,
    private verificationService: VerificationService,
    protected convertService: ConvertService,
    public paginationService: PaginationService
  ) {
    this.transferAmount = 1;
    this.transferFlags = new TransferFlags();
    this.shakeStateService = new ShakeStateService();
    this.paginationService.paginationMethod = 'movableItems';
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }

  public ngOnInit(): void {
    this.setUserAccounts();
  }

  public handleButtonClick(): void {
    this.validateFields();
    setTimeout(() => {
      const isSomeDataInvalid: boolean = this.actualTransferFlagsArray.some(
        (flag: boolean) => flag === false
      );
      if (isSomeDataInvalid === false) {
        this.userService.setTransferObject(
          this.currentSelectedAccount.id,
          this.transferReceiverAccountId,
          this.transferTitle,
          this.transferAmount
        );
        this.userService.operation = 'new-transfer';
        this.userService.sendVerificationEmail('wysłanie nowego przelewu');
      }
      this.shakeStateService.setCurrentShakeState(
        isSomeDataInvalid ? 'shake' : 'none'
      );
    }, 500);
  }

  public setUserAccounts(): void {
    this.userService.userAccounts.subscribe((newAccountsArray: Account[]) => {
      if (newAccountsArray.length >= 1) {
        this.userAccounts = newAccountsArray;
        this.paginationService.setPaginatedArray(this.userAccounts);
      }
    });
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
  }

  public async validateFields(): Promise<void> {
    this.setIsTransferAmountValid();
    this.setIsTransferTitleValid();
    await this.setsTransferReceiverAccountNumberValid();
  }

  public get maximumLimit(): number {
    this.correctTransferAmount();
    return this.currentSelectedAccount.balance ?? 0;
  }

  public correctTransferAmount(): void {
    const currentAccountBalance: number = Number(
      this.currentSelectedAccount?.balance ?? 0
    );
    const isTransferAmountHigher: boolean =
      this.transferAmount > currentAccountBalance;
    this.transferAmount = currentAccountBalance <= 1 ? 0 : this.transferAmount;
    if (isTransferAmountHigher) {
      this.transferAmount =
        this.transferAmount > currentAccountBalance
          ? currentAccountBalance
          : this.transferAmount;
    }
  }

  public get currentSelectedAccount(): Account {
    return this.paginationService.paginatedItems !== undefined
      ? this.paginationService.paginatedItems[1]
        ? this.paginationService.paginatedItems[1]
        : this.paginationService.paginatedItems[0]
      : new Account();
  }

  public get canShowInput(): boolean {
    const currentSelectedAccountBalance: number =
      this.currentSelectedAccount?.balance ?? 0;
    return currentSelectedAccountBalance >= 1;
  }

  private setIsTransferAmountValid(): void {
    this.transferFlags.isTransferAmountValid =
      this.verificationService.validateOperationAmount(
        this.transferAmount,
        this.currentSelectedAccount
      );
  }

  private setIsTransferTitleValid(): void {
    this.transferFlags.isTransferTitleValid =
      this.verificationService.validateTransferTitle(this.transferTitle);
  }

  private async setsTransferReceiverAccountNumberValid(): Promise<void> {
    const getIsAccountExists: boolean =
      await this.userService.getIsAccountExists(this.transferReceiverAccountId);
    const receiverAccountId: string =
      this.transferReceiverAccountId &&
      this.transferReceiverAccountId.replace(' ', '');
    const senderAccountId: string = this.currentSelectedAccount.id.replace(
      ' ',
      ''
    );
    this.transferFlags.isTransferReceiverAccountNumberValid =
      this.verificationService.validateReceiverAccountId(
        receiverAccountId,
        senderAccountId
      ) && getIsAccountExists;
  }

  private get actualTransferFlagsArray(): boolean[] {
    return [
      this.transferFlags.isTransferAmountValid,
      this.transferFlags.isTransferReceiverAccountNumberValid,
      this.transferFlags.isTransferTitleValid,
    ];
  }
}
