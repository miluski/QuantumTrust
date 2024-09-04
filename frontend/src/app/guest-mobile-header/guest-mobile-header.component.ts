import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { HeaderStateService } from '../../services/header-state.service';

@Component({
  selector: 'app-guest-mobile-header',
  templateUrl: './guest-mobile-header.component.html',
  imports: [CommonModule, RouterModule, MatDrawer],
  standalone: true,
})
export class GuestMobileHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  currentRoute: string = '/home-page';
  tabName: string = 'Konta';
  constructor(router: Router, private headerStateService: HeaderStateService) {
    this.currentRoute = router.url;
  }
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
    this.headerStateService.observeBreakpoints();
  }
  ngAfterViewInit(): void {
    this.headerStateService.changeDrawer(this.drawer);
  }
  changeTabName(tabName: string) {
    this.headerStateService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.headerStateService.toggleDrawer();
  }
}
