import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderStateService } from '../header-state.service';
import { HomePageComponent } from '../home-page/home-page.component';
import { RouterModule } from '@angular/router';

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
    RouterModule,
    HomePageComponent,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer?: MatDrawer;
  tabName: string = 'Konta';
  isDrawerOpened: boolean = false;

  constructor(
    private headerStateService: HeaderStateService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (tabName) => (this.tabName = tabName)
    );
    this.headerStateService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened) => {
        this.isDrawerOpened = isDrawerOpened;
      }
    );
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result) => {
        if (result.matches && this.drawer) {
          this.drawer.close();
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.drawer) {
      this.drawer.openedChange.subscribe((opened) => {
        this.isDrawerOpened = opened;
        this.headerStateService.changeIsDrawerOpened(opened);
      });
    }
  }

  changeTabName(tabName: string): void {
    this.headerStateService.changeTabName(tabName);
  }

  toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  isDrawerOpen(): boolean {
    return this.drawer ? this.drawer.opened : false;
  }
}
