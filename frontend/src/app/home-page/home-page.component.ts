import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderStateService } from '../header-state.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  standalone: true,
})
export class HomePageComponent implements OnInit {
  tabName: string = 'Konta';
  isDrawerOpened: boolean = false;
  constructor(private headerStateService: HeaderStateService) {}
  ngOnInit(): void {
    this.headerStateService.currentTabName.subscribe(
      (tabName) => (this.tabName = tabName)
    );
    this.headerStateService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
}
