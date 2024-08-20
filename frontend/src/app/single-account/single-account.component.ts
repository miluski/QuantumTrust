import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Account } from '../../types/account';
import { Step } from '../../types/step';
import { accountsObjectsArray } from '../../utils/accounts-objects-array';
import { singleAccountStepsArray } from '../../utils/steps-objects-arrays';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-single-account',
  templateUrl: './single-account.component.html',
  styleUrl: './single-account.component.css',
  imports: [
    HeaderComponent,
    FooterComponent,
    MatDividerModule,
    MatIconModule,
    CommonModule,
  ],
  standalone: true,
})
export class SingleAccountComponent implements OnInit {
  @Input() steps: Step[] = singleAccountStepsArray;
  @Output() scrollToTopEvent = new EventEmitter<void>();
  private accountType: string = 'personal';
  protected accountsArray: Account[] = [];
  protected accountObject!: Account;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {
    this.setAccountsArray();
  }
  ngOnInit(): void {
    this.productTypesService.currentAccountType.subscribe((accountType) => {
      this.accountType = accountType;
      this.setAccountsArray();
    });
    this.accountObject = this.getAccountObject();
    this.updateItemsPerPage(window.innerWidth);
    this.setAccountsArray();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateItemsPerPage(event.target.innerWidth);
  }
  updateItemsPerPage(width: number) {
    if (width <= 768) {
      this.itemsPerPage = 1;
    } else {
      this.currentPage = 1;
      this.itemsPerPage = 3;
    }
  }
  ACCOUNT_TYPE_MAP: { [key: string]: string } = {
    personal: 'osobiste',
    young: 'dla młodych',
    multiCurrency: 'wielowalutowe',
    family: 'rodzinne',
    oldPeople: 'senior',
  };
  changeAccountType(accountType: string): void {
    this.productTypesService.changeAccountType(accountType);
    this.updateItemsPerPage(window.innerWidth);
    this.setAccountsArray();
  }
  getPolishAccountType(accountType?: string): string {
    return this.ACCOUNT_TYPE_MAP[accountType ?? this.accountType] || 'osobiste';
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      const lastItem = this.accountsArray.pop();
      this.accountsArray.unshift(<Account>lastItem);
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const firstItem = this.accountsArray.shift();
      this.accountsArray.push(<Account>firstItem);
    }
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
    this.currentPage = 1;
  }
  trackById(step: Step): number {
    return step.id;
  }
  private setAccountsArray(): void {
    this.accountObject = this.getAccountObject();
    this.accountsArray = accountsObjectsArray.filter(
      (account: Account, _: number) => account.id !== this.accountObject.id
    );
  }
  private getAccountObject(): Account {
    return accountsObjectsArray.find(
      (account: Account) => account.type === this.accountType
    ) as Account;
  }
  get accountsPaginatedItems() {
    return this.accountsArray.slice(0, this.itemsPerPage);
  }
  get totalPages() {
    return Math.ceil(this.accountsArray.length / this.itemsPerPage);
  }
}
