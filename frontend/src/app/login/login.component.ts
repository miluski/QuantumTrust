import { Component } from '@angular/core';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private windowEventsService: WindowEventsService) {}
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
