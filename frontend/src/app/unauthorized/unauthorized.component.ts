import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderStateService } from '../../services/header-state.service';
import { WindowEventsService } from '../../services/window-events.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  standalone: true,
})
export class UnauthorizedComponent implements OnInit {
  isDrawerOpened: boolean = false;
  constructor(
    private headerStateService: HeaderStateService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.headerStateService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
