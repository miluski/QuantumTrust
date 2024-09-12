import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderStateService } from '../../services/header-state.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { FinancesComponent } from '../finances/finances.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [CommonModule, HeaderComponent, FooterComponent, FinancesComponent],
  standalone: true,
})
export class MainPageComponent implements OnInit {
  tabName: string = 'Finanse';
  constructor(private headerStateService: HeaderStateService) {}
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
  }
}
