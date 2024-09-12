import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductTypesService } from '../../services/product-types.service';
import { WindowEventsService } from '../../services/window-events.service';
import { Account } from '../../types/account';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class AccountListComponent implements OnInit {
  @Input() tabName: string = 'Konta';
  accountType: string = 'personal';
  accountsObjectsArray: Account[] = accountsObjectsArray;
  currentIndex: number = 0;
  constructor(
    private productTypeService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypeService.currentAccountType.subscribe(
      (accountType: string) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
  isAccountIdEven(accountId: string): boolean {
    return Number(accountId) % Number(2) === Number(0);
  }
}
