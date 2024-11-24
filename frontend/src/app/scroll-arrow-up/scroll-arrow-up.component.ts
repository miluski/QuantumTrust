import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { WindowEventsService } from '../../services/window-events.service';

/**
 * @component ScrollArrowUpComponent
 * @description This component is responsible for displaying a scroll-to-top arrow and managing its behavior.
 *
 * @selector app-scroll-arrow-up
 * @templateUrl ./scroll-arrow-up.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class ScrollArrowUpComponent
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a browser.
 * @param {WindowEventsService} windowEventsService - Service to manage window events.
 *
 * @method scrollToTop - Scrolls the window to the top.
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

  public scrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
