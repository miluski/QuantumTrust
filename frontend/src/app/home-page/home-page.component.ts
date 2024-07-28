import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TabStateService } from '../tab-state.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  imports: [HeaderComponent],
  standalone: true,
})
export class HomePageComponent implements OnInit {
  tabName: string = 'Konta';
  constructor(private tabStateService: TabStateService) {}
  ngOnInit(): void {
    this.tabStateService.currentTabName.subscribe(
      (tabName) => (this.tabName = tabName)
    );
  }
}
