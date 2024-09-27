import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

@Component({
  selector: 'app-guest-mobile-header',
  templateUrl: './guest-mobile-header.component.html',
  imports: [CommonModule, RouterModule, MatDrawer],
  standalone: true,
})
export class GuestMobileHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  protected currentRoute: string = '/home-page';
  protected tabName: string = 'Konta';
  constructor(
    router: Router,
    private appInformationStatesService: AppInformationStatesService
  ) {
    this.currentRoute = router.url;
  }
  ngOnInit(): void {
    this.appInformationStatesService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
    this.appInformationStatesService.observeBreakpoints();
  }
  ngAfterViewInit(): void {
    this.appInformationStatesService.changeDrawer(this.drawer);
  }
  changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
}
