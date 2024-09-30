import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnimationsProvider } from '../../providers/animations.provider';
import { WindowEventsService } from '../../services/window-events.service';

/**
 * Component that displays a scroll arrow button to scroll to the top of the page.
 *
 * @selector 'app-scroll-arrow-up'
 * @templateUrl './scroll-arrow-up.component.html'
 * @imports [CommonModule, MatTooltipModule]
 * @animations [AnimationsProvider.animations]
 * @standalone true
 *
 * @method scrollToTop Scrolls the window to the top of the page with a smooth scrolling behavior.
 */
@Component({
  selector: 'app-scroll-arrow-up',
  templateUrl: './scroll-arrow-up.component.html',
  imports: [CommonModule, MatTooltipModule],
  animations: [AnimationsProvider.animations],
  standalone: true,
})
export class ScrollArrowUpComponent {
  constructor(protected windowEventsService: WindowEventsService) {
    this.windowEventsService.startPulsing();
  }
  scrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
