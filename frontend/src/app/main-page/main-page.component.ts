import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderStateService } from '../../services/header-state.service';
import { FinancesComponent } from '../finances/finances.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
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
  ],
  standalone: true,
})
export class MainPageComponent implements OnInit {
  tabName: string = 'Finanse';
  constructor(
    private headerStateService: HeaderStateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.headerStateService.changeTabName(this.tabName);
  }
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (currentTabName: string) => {
        this.tabName = currentTabName;
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
