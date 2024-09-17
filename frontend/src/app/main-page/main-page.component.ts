import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FinancesComponent } from '../finances/finances.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NewTransferComponent } from '../new-transfer/new-transfer.component';
import { OpenDepositComponent } from '../open-deposit/open-deposit.component';
import { SingleAccountTransactionsComponent } from '../single-account-transactions/single-account-transactions.component';
import { UserOpenAccountComponent } from '../user-open-account/user-open-account.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FinancesComponent,
    UserOpenAccountComponent,
    SingleAccountTransactionsComponent,
    OpenDepositComponent,
    NewTransferComponent,
  ],
  standalone: true,
})
export class MainPageComponent implements OnInit {
  tabName: string = 'Finanse';
  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.appInformationStatesService.changeTabName(this.tabName);
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => {
        this.tabName = currentTabName;
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
