import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimationsProvider } from '../../providers/animations.provider';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { WindowEventsService } from '../../services/window-events.service';
import { AccountListComponent } from '../account-list/account-list.component';
import { CardListComponent } from '../card-list/card-list.component';
import { DepositListComponent } from '../deposit-list/deposit-list.component';
import { FooterComponent } from '../footer/footer.component';
import { GuestMobileHeaderComponent } from '../guest-mobile-header/guest-mobile-header.component';
import { HeaderComponent } from '../header/header.component';
import { ScrollArrowUpComponent } from '../scroll-arrow-up/scroll-arrow-up.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  animations: [AnimationsProvider.animations],
  imports: [
    HeaderComponent,
    FooterComponent,
    AccountListComponent,
    DepositListComponent,
    CardListComponent,
    GuestMobileHeaderComponent,
    ScrollArrowUpComponent,
    CommonModule,
    RouterModule,
  ],
  standalone: true,
})
export class HomePageComponent implements OnInit {
  protected tabName: string = 'Konta';
  protected isDrawerOpened: boolean = false;
  constructor(
    private appInformationStatesService: AppInformationStatesService,
    protected windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}
