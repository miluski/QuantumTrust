import { Component } from '@angular/core';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-open-account',
  templateUrl: './open-account.component.html',
  styleUrl: './open-account.component.css',
})
export class OpenAccountComponent {
  constructor(private windowEventsService: WindowEventsService) {}
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
