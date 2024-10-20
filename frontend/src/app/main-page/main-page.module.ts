import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountSettingsModule } from '../account-settings/account-settings.module';
import { CardSettingsModule } from '../card-settings/card-settings.module';
import { CustomAlertModule } from '../custom-alert/custom-alert.module';
import { FinancesModule } from '../finances/finances.module';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { NewTransferModule } from '../new-transfer/new-transfer.module';
import { OpenDepositModule } from '../open-deposit/open-deposit.module';
import { OrderCardModule } from '../order-card/order-card.module';
import { ScrollArrowUpModule } from '../scroll-arrow-up/scroll-arrow-up.module';
import { SingleAccountTransactionsModule } from '../single-account-transactions/single-account-transactions.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserOpenAccountModule } from '../user-open-account/user-open-account.module';
import { MainPageComponent } from './main-page.component';

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FinancesModule,
    UserOpenAccountModule,
    SingleAccountTransactionsModule,
    OpenDepositModule,
    NewTransferModule,
    OrderCardModule,
    CardSettingsModule,
    TransactionsModule,
    AccountSettingsModule,
    CustomAlertModule,
    ScrollArrowUpModule,
    FooterModule,
    RouterModule.forChild([
      { path: '', component: MainPageComponent },
    ]),
  ],
  exports: [MainPageComponent],
})
export class MainPageModule {}
