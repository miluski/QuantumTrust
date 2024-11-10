import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountListModule } from '../account-list/account-list.module';
import { CardListModule } from '../card-list/card-list.module';
import { CustomAlertModule } from '../custom-alert/custom-alert.module';
import { DepositListModule } from '../deposit-list/deposit-list.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { HomePageComponent } from './home-page.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    HeaderModule,
    AccountListModule,
    DepositListModule,
    CardListModule,
    CustomAlertModule,
    ScrollArrowUpModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
      },
    ]),
  ],
  exports: [HomePageComponent],
})
export class HomePageModule {}
