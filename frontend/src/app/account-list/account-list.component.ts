import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from '../../types/account';
import { ProductTypesService } from '../product-types.service';
import { accountsObjectsArray } from './accounts-objects-array';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class AccountListComponent implements OnInit {
  @Input() tabName: string = 'Konta';
  accountType: string = 'personal';
  accountsObjectsArray: Account[] = accountsObjectsArray;
  constructor(private productTypeService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypeService.currentAccountType.subscribe(
      (accountType) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
}
