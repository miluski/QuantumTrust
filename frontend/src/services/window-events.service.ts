import { Injectable } from '@angular/core';

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
