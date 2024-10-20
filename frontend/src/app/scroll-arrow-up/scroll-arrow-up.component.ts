import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { WindowEventsService } from '../../services/window-events.service';

/**
 * Component that displays a scroll arrow button to scroll to the top of the page.
 *
 * @selector 'app-scroll-arrow-up'
 * @templateUrl './scroll-arrow-up.component.html'
 * @animations [AnimationsProvider.animations]
 *
 * @method scrollToTop Scrolls the window to the top of the page with a smooth scrolling behavior.
 */
@Component({
  selector: 'app-scroll-arrow-up',
  templateUrl: './scroll-arrow-up.component.html',
  animations: [AnimationsProvider.animations],
})
export class ScrollArrowUpComponent {
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    protected windowEventsService: WindowEventsService
  ) {
    if (isPlatformBrowser(platformId)) {
      this.windowEventsService.startPulsing();
    }
  }
  scrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
