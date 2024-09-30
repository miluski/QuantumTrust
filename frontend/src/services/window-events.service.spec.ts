import { TestBed } from '@angular/core/testing';
import { WindowEventsService } from './window-events.service';

describe('WindowEventsService', () => {
  let service: WindowEventsService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowEventsService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should toggle pulseState between "start" and "end"', (done) => {
    service.startPulsing();
    expect(service.pulseState).toBe('start');
    setTimeout(() => {
      expect(service.pulseState).toBe('end');
      setTimeout(() => {
        expect(service.pulseState).toBe('start');
        done();
      }, 1000);
    }, 1000);
  });
  it('should scroll to top', (done) => {
    window.scrollTo(0, 100);
    service.scrollToTop();
    setTimeout(() => {
      expect(window.scrollY).toBe(0);
      done();
    }, 2100);
  });
  it('should not scroll if already at top', () => {
    window.scrollTo(0, 0);
    const spy = spyOn(window, 'requestAnimationFrame');
    service.scrollToTop();
    expect(spy).not.toHaveBeenCalled();
  });
  it('should ease in and out cubic correctly', () => {
    expect(service['easeInOutCubic'](0)).toBe(0);
    expect(service['easeInOutCubic'](0.5)).toBeCloseTo(0.5, 1);
    expect(service['easeInOutCubic'](1)).toBe(1);
  });
});
