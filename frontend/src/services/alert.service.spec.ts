import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(service.isOpened).toBeFalse();
    expect(service.progressValue).toBe(100);
    expect(service['secondsLeftToClose']).toBe(30);
  });
  it('should open the alert and start the countdown', (done) => {
    service.show();
    expect(service.isOpened).toBeTrue();
    setTimeout(() => {
      expect(service['secondsLeftToClose']).toBeLessThan(30);
      expect(service.progressValue).toBeLessThan(100);
      done();
    }, 2000);
  });
  it('should close the alert', () => {
    service.show();
    service.close();
    expect(service.isOpened).toBeFalse();
  });
  it('should update progress correctly', () => {
    service['secondsLeftToClose'] = 15;
    service['updateProgress']();
    expect(service.progressValue).toBe(50);
  });
  it('should reset the countdown when closed automatically', (done) => {
    service.show();
    service['secondsLeftToClose'] = 1;
    setTimeout(() => {
      expect(service['secondsLeftToClose']).toBe(0);
      done();
    }, 1500);
  });
});