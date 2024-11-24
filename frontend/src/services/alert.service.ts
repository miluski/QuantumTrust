import { Injectable } from '@angular/core';

/**
 * @class AlertService
 * @description This service is responsible for managing alerts in the application.
 *
 * @providedIn 'root'
 *
 * @property {NodeJS.Timeout} interval - The interval for updating the progress bar.
 * @property {number} secondsLeftToClose - The number of seconds left to close the alert.
 * @property {boolean} isOpened - Flag indicating if the alert is opened.
 * @property {string} alertIcon - The icon of the alert.
 * @property {string} alertTitle - The title of the alert.
 * @property {string} alertContent - The content of the alert.
 * @property {number} progressValue - The progress value of the progress bar.
 * @property {string} progressBarBorderColor - The border color of the progress bar.
 * @property {'info' | 'warning' | 'error'} alertType - The type of the alert.
 *
 * @constructor
 *
 * @method show - Shows the alert and starts the interval for updating the progress bar.
 * @method close - Closes the alert.
 * @method runIntervalFn - Runs the interval function to update the progress bar and close the alert after 30 seconds.
 * @method updateProgress - Updates the progress value of the progress bar.
 * @method resetCredentials - Resets the credentials of the alert.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private interval!: any;
  private secondsLeftToClose: number;

  public isOpened: boolean;
  public alertIcon!: string;
  public alertTitle!: string;
  public alertContent!: string;
  public progressValue: number;
  public progressBarBorderColor!: string;
  public alertType!: 'info' | 'warning' | 'error';

  constructor() {
    this.secondsLeftToClose = 30;
    this.progressValue = 100;
    this.isOpened = false;
  }

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
