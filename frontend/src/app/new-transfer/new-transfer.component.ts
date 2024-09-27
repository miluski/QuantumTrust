import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { TransferFlags } from '../../types/transfer-flags';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    VerificationCodeComponent,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  standalone: true,
})
export class NewTransferComponent implements OnInit {
  protected transferTitle!: string;
  protected transferReceiverAccountId!: string;
  protected transferAmount: number = 1;
  protected shakeStateService: ShakeStateService = new ShakeStateService();
  protected transferFlags: TransferFlags = new TransferFlags();
  constructor(
    private userService: UserService,
    private verificationService: VerificationService,
    protected paginationService: PaginationService,
    protected convertService: ConvertService
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
    this.shakeStateService.setCurrentShakeState(isSomeDataInvalid);
  }
  async setUserAccounts(): Promise<void> {
    const userAccounts: Account[] =
      await this.userService.getUserAccountsArray();
    this.paginationService.setPaginatedArray(userAccounts);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
  }
  get currentSelectedAccount(): Account {
    return this.paginationService.paginatedItems
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
  private validateFields(): void {
    this.setIsTransferAmountValid();
    this.setIsTransferTitleValid();
    this.setsTransferReceiverAccountNumberValid();
  }
  private setIsTransferAmountValid(): void {
    this.transferFlags.isTransferAmountValid =
      this.verificationService.validateOperationAmount(
        this.transferAmount,
        this.paginationService.paginatedItems[1]
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
    const senderAccountId: string =
      this.paginationService.paginatedItems &&
      this.paginationService.paginatedItems[1].id.replace(' ', '');
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
