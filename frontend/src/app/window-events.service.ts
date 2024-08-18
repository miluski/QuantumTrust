import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowEventsService {
  scrollToTop(): void {
    const duration = 2000;
    const start = window.scrollY;
    const startTime = performance.now();
    function scrollStep(timestamp: number) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) {
        window.requestAnimationFrame(scrollStep);
      }
    }
    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    window.requestAnimationFrame(scrollStep);
  }
}
