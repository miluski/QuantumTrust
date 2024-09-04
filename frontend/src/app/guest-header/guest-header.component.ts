import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HeaderStateService } from '../../services/header-state.service';

@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
})
export class GuestHeaderComponent implements OnInit {
  currentRoute: string = '/home-page';
  tabName: string = 'Konta';
  constructor(router: Router, private headerStateService: HeaderStateService) {
    this.currentRoute = router.url;
  }
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (currentTabName: string) => (this.tabName = currentTabName)
    );
  }
  changeTabName(tabName: string) {
    this.headerStateService.changeTabName(tabName);
  }
  toggleDrawer(): void {
    this.headerStateService.toggleDrawer();
  }
}
