import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private totalSeconds = 30;
  private secondsLeftToClose = this.totalSeconds;
  public isOpened = false;
  public progressValue = 100;
  public alertType!: 'info' | 'warning' | 'error';
  public alertContent!: string;
  public alertTitle!: string;
  public show(): void {
    this.isOpened = true;
    const interval = setInterval(() => {
      if (this.secondsLeftToClose <= 0) {
        this.close();
        this.secondsLeftToClose = this.totalSeconds;
        clearInterval(interval);
      } else {
        this.secondsLeftToClose--;
        this.updateProgress();
      }
    }, 1000);
  }
  public close(): void {
    this.isOpened = false;
  }
  private updateProgress(): void {
    this.progressValue = (this.secondsLeftToClose / this.totalSeconds) * 100;
  }
}
