import { Component, HostListener, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { TransferFlags } from '../../types/transfer-flags';

/**
 * @fileoverview NewTransferComponent handles the creation of new transfers.
 * It includes methods for validating transfer details, setting user accounts,
 * and handling UI events such as window resizing.
 *
 * @component
 * @selector app-new-transfer
 * @templateUrl ./new-transfer.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class NewTransferComponent
 * @implements OnInit
 *
 * @property {string} transferTitle - The title of the transfer.
 * @property {string} transferReceiverAccountId - The receiver's account ID.
 * @property {number} transferAmount - The amount to be transferred.
 * @property {ShakeStateService} shakeStateService - Service to manage shake state.
 * @property {TransferFlags} transferFlags - Flags indicating the validity of transfer fields.
 *
 * @constructor
 * @param {UserService} userService - Service to handle user-related operations.
 * @param {VerificationService} verificationService - Service to handle verification operations.
 * @param {PaginationService} paginationService - Service to handle pagination.
 * @param {ConvertService} convertService - Service to handle conversions.
 *
 * @method ngOnInit - Initializes the component and sets user accounts.
 * @method onResize - Handles window resize events.
 * @param {UIEvent} event - The resize event.
 * @method handleButtonClick - Handles button click events and validates fields.
 * @method setUserAccounts - Sets the user accounts and handles width changes.
 * @method get currentSelectedAccount - Retrieves the currently selected account.
 * @method get currentTransferAmount - Retrieves the current transfer amount.
 * @method validateFields - Validates the transfer fields.
 * @method setIsTransferAmountValid - Validates the transfer amount.
 * @method setIsTransferTitleValid - Validates the transfer title.
 * @method setsTransferReceiverAccountNumberValid - Validates the receiver's account number.
 * @method get actualTransferFlagsArray - Retrieves an array of transfer flags.
 */
@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.component.html',
  animations: [AnimationsProvider.animations],
})
export class NewTransferComponent implements OnInit {
  public transferTitle!: string;
  public transferReceiverAccountId!: string;
  public transferAmount: number = 1;
  public shakeStateService: ShakeStateService = new ShakeStateService();
  public transferFlags: TransferFlags = new TransferFlags();
  constructor(
    private userService: UserService,
    private verificationService: VerificationService,
    protected convertService: ConvertService,
    public paginationService: PaginationService
  ) {
    this.paginationService.paginationMethod = 'movableItems';
  }
  ngOnInit(): void {
    this.setUserAccounts();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.paginationService.onResize(event, 3, 3);
  }
  handleButtonClick(): void {
    this.validateFields();
    const isSomeDataInvalid: boolean = this.actualTransferFlagsArray.some(
      (flag: boolean) => flag === false
    );
    this.shakeStateService.setCurrentShakeState(
      isSomeDataInvalid ? 'shake' : 'none'
    );
  }
  async setUserAccounts(): Promise<void> {
    const userAccounts: Account[] =
      await this.userService.getUserAccountsArray();
    this.paginationService.setPaginatedArray(userAccounts);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
  }
  get currentSelectedAccount(): Account {
    return this.paginationService.paginatedItems !== undefined
      ? this.paginationService.paginatedItems[1]
        ? this.paginationService.paginatedItems[1]
        : this.paginationService.paginatedItems[0]
      : new Account();
  }
  get currentTransferAmount(): number {
    this.transferAmount =
      this.currentSelectedAccount.balance &&
      this.transferAmount > this.currentSelectedAccount.balance
        ? this.currentSelectedAccount.balance
        : this.transferAmount;
    return this.transferAmount;
  }
  public validateFields(): void {
    this.setIsTransferAmountValid();
    this.setIsTransferTitleValid();
    this.setsTransferReceiverAccountNumberValid();
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
  private setsTransferReceiverAccountNumberValid(): void {
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
      );
  }
  private get actualTransferFlagsArray(): boolean[] {
    return [
      this.transferFlags.isTransferAmountValid,
      this.transferFlags.isTransferReceiverAccountNumberValid,
      this.transferFlags.isTransferTitleValid,
    ];
  }
}
