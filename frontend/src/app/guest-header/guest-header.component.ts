import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AppInformationStatesService } from '../../services/app-information-states.service';

@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
})
export class GuestHeaderComponent implements OnInit {
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
  }
  changeTabName(tabName: string) {
    this.appInformationStatesService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.appInformationStatesService.toggleDrawer();
  }
}
