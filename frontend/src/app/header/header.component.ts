import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomePageComponent } from '../home-page/home-page.component';
import { TabStateService } from '../tab-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    CommonModule,
    HomePageComponent,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  tabName: string = 'Konta';
  constructor(private tabStateService: TabStateService) {}
  ngOnInit(): void {
    this.tabStateService.currentTabName.subscribe(
      (tabName) => (this.tabName = tabName)
    );
  }
  changeTabName(tabName: string): void {
    this.tabStateService.changeTabName(tabName);
  }
}
