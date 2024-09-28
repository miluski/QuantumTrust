import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ProductTypesService } from '../../services/product-types.service';
import { Account } from '../../types/account';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  animations: [AnimationsProvider.animations],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class AccountListComponent implements OnInit {
  @Input() tabName: string = 'Konta';
  protected accountType: string = 'personal';
  protected accountsObjectsArray: Account[] = accountsObjectsArray;
  protected currentIndex: number = 0;
  constructor(private productTypeService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypeService.currentAccountType.subscribe(
      (accountType: string) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
  isAccountIdEven(accountId: string): boolean {
    return Number(accountId) % 2 === 0;
  }
}
