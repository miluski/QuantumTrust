import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { Account } from '../../types/account';

@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.component.html',
  imports: [MatIconModule, CommonModule, FormsModule],
  standalone: true,
})
export class NewTransferComponent implements OnInit {
  protected transferTitle!: string;
  protected transferReceiverAccountId!: string;
  protected transferAmount: number = 1;
  constructor(
    private userService: UserService,
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
  async setUserAccounts(): Promise<void> {
    const userAccounts: Account[] =
      await this.userService.getUserAccountsArray();
    this.paginationService.setPaginatedArray(userAccounts);
    this.paginationService.handleWidthChange(window.innerWidth, 3, 3);
  }
  get currentSelectedAccount(): Account {
    return this.paginationService.paginatedItems[1]
      ? this.paginationService.paginatedItems[1]
      : this.paginationService.paginatedItems[0];
  }
  get currentTransferAmount(): number {
    this.transferAmount =
      this.currentSelectedAccount.balance &&
      this.transferAmount > this.currentSelectedAccount.balance
        ? this.currentSelectedAccount.balance
        : this.transferAmount;
    return this.transferAmount;
  }
}
