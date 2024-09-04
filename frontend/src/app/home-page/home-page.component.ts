import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderStateService } from '../../services/header-state.service';
import { WindowEventsService } from '../../services/window-events.service';
import { AccountListComponent } from '../account-list/account-list.component';
import { CardListComponent } from '../card-list/card-list.component';
import { DepositListComponent } from '../deposit-list/deposit-list.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [
    HeaderComponent,
    FooterComponent,
    AccountListComponent,
    CommonModule,
    RouterModule,
    DepositListComponent,
    CardListComponent,
  ],
  standalone: true,
})
export class HomePageComponent implements OnInit {
  tabName: string = 'Konta';
  isDrawerOpened: boolean = false;
  constructor(
    private headerStateService: HeaderStateService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
    this.headerStateService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
