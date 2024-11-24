import { Injectable } from '@angular/core';

/**
 * @class WindowEventsService
 * @description This service is responsible for managing window events such as pulsing and scrolling to the top.
 *
 * @providedIn 'root'
 *
 * @property {number} duration - The duration for the scroll animation.
 * @property {string} pulseState - The current state of the pulsing animation.
 *
 * @constructor
 *
 * @method startPulsing - Starts the pulsing animation by toggling the pulse state every second.
 * @method scrollToTop - Scrolls the window to the top with a smooth animation.
 * @method easeInOutCubic - Easing function for the scroll animation.
 * @param {number} t - The current time progress of the animation.
 * @returns {number} - Returns the eased value.
 */
@Injectable({
  providedIn: 'root',
})
export class WindowEventsService {
  private duration: number;

  public pulseState: string;

  constructor() {
    this.duration = 2000;
    this.pulseState = 'start';
  }

  public startPulsing(): void {
    setInterval(() => {
      this.pulseState = this.pulseState === 'start' ? 'end' : 'start';
    }, 1000);
  }

  public scrollToTop(): void {
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
