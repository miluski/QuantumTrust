import { Injectable } from '@angular/core';

/**
 * @class ShakeStateService
 * @description This service is responsible for managing the shake state of the component.
 *
 * @providedIn 'root'
 *
 * @property {number} currentSiteNumber - The current site number.
 * @property {'shake' | 'none' | ''} currentShakeState - The current shake state.
 *
 * @constructor
 *
 * @method setCurrentShakeState - Sets the current shake state and changes the site if necessary.
 * @param {'shake' | 'none' | ''} state - The new shake state to be set.
 * @method shakeState - Getter method to get the current shake state.
 * @returns {'shake' | 'none' | ''} - Returns the current shake state.
 * @method siteNumber - Getter method to get the current site number.
 * @returns {number} - Returns the current site number.
 * @method changeSiteIfNeccessary - Changes the site number if the shake state is 'none'.
 * @method resetShakeState - Resets the shake state to 'none' after a timeout.
 */
@Injectable({
  providedIn: 'root',
})
export class ShakeStateService {
  public currentSiteNumber: number;
  private currentShakeState: 'shake' | 'none' | '';

  constructor() {
    this.currentSiteNumber = 1;
    this.currentShakeState = '';
  }

  public setCurrentShakeState(state: 'shake' | 'none' | ''): void {
    this.currentShakeState = state;
    this.changeSiteIfNeccessary();
    this.resetShakeState();
  }

  public get shakeState(): 'shake' | 'none' | '' {
    return this.currentShakeState;
  }

  public get siteNumber(): number {
    return this.currentSiteNumber;
  }

  private changeSiteIfNeccessary(): void {
    this.currentShakeState === 'none' ? this.currentSiteNumber++ : null;
  }

  private resetShakeState(): void {
    setTimeout(() => (this.currentShakeState = 'none'), 500);
  }
}
