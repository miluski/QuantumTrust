import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { ProductTypesService } from '../product-types.service';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
  styleUrl: './deposit-list.component.css',
  imports: [MatIconModule, CommonModule, RouterModule],
  standalone: true,
})
export class DepositListComponent implements OnInit {
  @Input() tabName: string = 'Lokaty';
  depositType: string = 'timely';
  depositsObjectArray: Deposit[] = depositsObjectArray;
  constructor(private productTypesService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType) => (this.depositType = depositType)
    );
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
  }
}
