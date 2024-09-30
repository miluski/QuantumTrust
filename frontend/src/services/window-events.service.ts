import { Injectable } from '@angular/core';

/**
 * @fileoverview WindowEventsService manages window-related events such as pulsing and scrolling.
 * It provides functionalities to start a pulsing animation and to smoothly scroll to the top of the page.
 *
 * @service
 * @providedIn root
 *
 * @class WindowEventsService
 * @property {number} duration - The duration of the scroll animation in milliseconds.
 * @property {string} pulseState - The current state of the pulsing animation ('start' or 'end').
 *
 * @method startPulsing - Starts a pulsing animation that alternates the pulseState between 'start' and 'end' every second.
 * @method scrollToTop - Smoothly scrolls the window to the top over a duration.
 * @method easeInOutCubic - Easing function for smooth scrolling.
 * @param {number} t - The current time progress of the animation.
 * @returns {number} - The eased value.
 */
@Injectable({
  providedIn: 'root',
})
export class WindowEventsService {
  private duration: number = 2000;
  public pulseState: string = 'start';
  startPulsing(): void {
    setInterval(() => {
      this.pulseState = this.pulseState === 'start' ? 'end' : 'start';
    }, 1000);
  }
  scrollToTop(): void {
    if (window.scrollY === 0) {
      return;
    }
    const start = window.scrollY;
    const startTime = performance.now();
    const scrollStep = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / this.duration, 1);
      const ease = this.easeInOutCubic(progress);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) {
        window.requestAnimationFrame(scrollStep);
      }
    };
    window.requestAnimationFrame(scrollStep);
  }
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
