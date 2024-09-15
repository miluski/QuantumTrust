import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
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
    private appInformationStatesService: AppInformationStatesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.appInformationStatesService.currentIsDrawerOpened.subscribe(
      (isDrawerOpened: boolean) => (this.isDrawerOpened = isDrawerOpened)
    );
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
