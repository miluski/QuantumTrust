import { Component, OnInit } from '@angular/core';
import { ProductTypesService } from '../product-types.service';

@Component({
  selector: 'app-single-account',
  templateUrl: './single-account.component.html',
  styleUrl: './single-account.component.css',
})
export class SingleAccountComponent implements OnInit {
  private accountType: string = 'personal';
  constructor(private productTypesService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe(
      (accountType) => (this.accountType = accountType)
    );
  }
  changeAccountType(accountType: string): void {
    this.productTypesService.changeAccountType(accountType);
  }
}
