import { Injectable } from '@angular/core';

/**
 * @fileoverview ShakeStateService manages the shake state and site number.
 * It provides functionalities to set the current shake state, get the current shake state, and get the current site number.
 *
 * @service
 * @providedIn root
 *
 * @class ShakeStateService
 * @property {('shake' | 'none' | '')} currentShakeState - The current shake state.
 * @property {number} currentSiteNumber - The current site number.
 *
 * @method setCurrentShakeState - Sets the current shake state and changes the site number if necessary.
 * @param {('shake' | 'none' | '')} state - The new shake state.
 * @method shakeState - Gets the current shake state.
 * @returns {('shake' | 'none' | '')} - The current shake state.
 * @method siteNumber - Gets the current site number.
 * @returns {number} - The current site number.
 * @method changeSiteIfNeccessary - Changes the site number if the current shake state is 'none'.
 * @method resetShakeState - Resets the shake state to 'none' after a timeout.
 */
@Injectable({
  providedIn: 'root',
})
export class ShakeStateService {
  private currentShakeState: 'shake' | 'none' | '' = '';
  private currentSiteNumber: number = 1;
  public setCurrentShakeState(state: 'shake' | 'none' | ''): void {
    this.currentShakeState = state;
    this.changeSiteIfNeccessary();
    this.resetShakeState();
  }
  get shakeState(): 'shake' | 'none' | '' {
    return this.currentShakeState;
  }
  get siteNumber(): number {
    return this.currentSiteNumber;
  }
  private changeSiteIfNeccessary(): void {
    this.currentShakeState === 'none' ? this.currentSiteNumber++ : null;
  }
  private resetShakeState(): void {
    setTimeout(() => (this.currentShakeState = 'none'), 500);
  }
}
