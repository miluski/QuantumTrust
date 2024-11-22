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
  private secondsLeftToClose: number = 30;
  private interval!: NodeJS.Timeout;
  public isOpened: boolean = false;
  public progressValue: number = 100;
  public alertType!: 'info' | 'warning' | 'error';
  public alertContent!: string;
  public alertTitle!: string;
  public alertIcon!: string;
  public progressBarBorderColor!: string;

  public show(): void {
    this.resetCredentials();
    this.runIntervalFn();
    this.isOpened = true;
  }

  public close(): void {
    this.isOpened = false;
  }

  private runIntervalFn(): void {
    this.interval = setInterval(() => {
      if (this.secondsLeftToClose <= 1) {
        this.resetCredentials();
        this.close();
      } else {
        this.secondsLeftToClose--;
        this.updateProgress();
      }
    }, 1000);
  }

  private updateProgress(): void {
    this.progressValue = (this.secondsLeftToClose / 30) * 100;
  }

  private resetCredentials(): void {
    this.interval ? clearInterval(this.interval) : null;
    this.secondsLeftToClose = 30;
    this.progressValue = 100;
  }
}
