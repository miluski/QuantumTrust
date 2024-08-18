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

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '600ms ease-in',
          keyframes([
            style({ transform: 'translateX(0)', opacity: 1, offset: 1.0 }),
          ])
        ),
      ]),
      transition(':leave', [
        animate(
          '600ms ease-out',
          keyframes([
            style({ transform: 'translateX(100%)', opacity: 0, offset: 1.0 }),
          ])
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  standalone: true,
})
export class AccountListComponent implements OnInit {
  @Input() tabName: string = 'Konta';
  accountType: string = 'personal';
  accountsObjectsArray: Account[] = accountsObjectsArray;
  currentIndex: number = 0;
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
