import { Component, OnInit } from '@angular/core';
import { ProductTypesService } from '../product-types.service';

@Component({
  selector: 'app-single-deposit',
  templateUrl: './single-deposit.component.html',
  styleUrl: './single-deposit.component.css',
})
export class SingleDepositComponent implements OnInit {
  private depositType: string = 'timely';
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
