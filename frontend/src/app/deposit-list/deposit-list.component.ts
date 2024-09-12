import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductTypesService } from '../../services/product-types.service';
import { WindowEventsService } from '../../services/window-events.service';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
  imports: [MatIconModule, CommonModule, RouterModule],
  standalone: true,
})
export class DepositListComponent implements OnInit {
  @Input() tabName: string = 'Lokaty';
  depositType: string = 'timely';
  depositsObjectArray: Deposit[] = depositsObjectArray;
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => (this.depositType = depositType)
    );
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
  isDepositIdHigherThanTwo(depositId: string): boolean {
    return Number(depositId) > Number(2);
  }
}
