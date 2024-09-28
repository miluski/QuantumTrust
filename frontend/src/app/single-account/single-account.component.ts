import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Account } from '../../types/account';
import { Step } from '../../types/step';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { singleAccountStepsArray } from '../../utils/steps-objects-arrays';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ScrollArrowUpComponent } from '../scroll-arrow-up/scroll-arrow-up.component';

@Component({
  selector: 'app-single-account',
  templateUrl: './single-account.component.html',
  imports: [
    HeaderComponent,
    FooterComponent,
    ScrollArrowUpComponent,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    RouterModule,
  ],
  standalone: true,
})
export class SingleAccountComponent implements OnInit {
  @Input() steps: Step[] = singleAccountStepsArray;
  protected accountType: string = 'personal';
  protected accountObject!: Account;
  constructor(
    private productTypesService: ProductTypesService,
    protected paginationService: PaginationService,
    public convertService: ConvertService
  ) {
    this.setAccountsArray();
  }
  ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe(
      (accountType: string) => {
        this.accountType = accountType;
        this.setAccountsArray();
      }
    );
    this.accountObject = this.getAccountObject();
    this.setAccountsArray();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.paginationService.onResize(event);
  }
  changeAccountType(accountType: string): void {
    this.productTypesService.changeAccountType(accountType);
    this.setAccountsArray();
  }
  trackById(step: Step): number {
    return step.id;
  }
  private setAccountsArray(): void {
    this.accountObject = this.getAccountObject();
    this.paginationService.setPaginatedArray(
      accountsObjectsArray.filter(
        (account: Account, _: number) => account.id !== this.accountObject.id
      )
    );
    this.paginationService.handleWidthChange(window.innerWidth);
  }
  private getAccountObject(): Account {
    return accountsObjectsArray.find(
      (account: Account) => account.type === this.accountType
    ) as Account;
  }
}
