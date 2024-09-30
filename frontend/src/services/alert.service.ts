import { Injectable } from '@angular/core';

/**
 * @fileoverview AlertService manages the display and timing of alert messages.
 * It provides functionalities to show and close alerts, and updates the progress value based on a countdown timer.
 *
 * @service
 * @providedIn root
 *
 * @class AlertService
 * @property {number} totalSeconds - The total number of seconds for the alert countdown.
 * @property {number} secondsLeftToClose - The number of seconds left before the alert automatically closes.
 * @property {boolean} isOpened - Indicates whether the alert is currently opened.
 * @property {number} progressValue - The current progress value of the alert countdown.
 * @property {'info' | 'warning' | 'error'} alertType - The type of alert being displayed.
 * @property {string} alertContent - The content of the alert message.
 * @property {string} alertTitle - The title of the alert message.
 *
 * @method show - Displays the alert and starts the countdown timer.
 * @method close - Closes the alert.
 * @method updateProgress - Updates the progress value based on the remaining time.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private secondsLeftToClose = 30;
  public isOpened = false;
  public progressValue = 100;
  public alertType!: 'info' | 'warning' | 'error';
  public alertContent!: string;
  public alertTitle!: string;
  public show(): void {
    this.secondsLeftToClose = 30;
    this.isOpened = true;
    const interval = setInterval(() => {
      if (this.secondsLeftToClose <= 0) {
        this.close();
        this.secondsLeftToClose = 30;
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
    this.progressValue = (this.secondsLeftToClose / 30) * 100;
  }
}
