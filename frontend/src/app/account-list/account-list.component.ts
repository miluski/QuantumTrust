import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from '../../types/account';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

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
  currentIndex: number = 0;
  constructor(
    private productTypeService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypeService.currentAccountType.subscribe(
      (accountType) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypeService.changeAccountType(accountType);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
