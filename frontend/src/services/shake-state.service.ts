import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShakeStateService {
  private currentShakeState: string = '';
  private currentSiteNumber: number = 1;
  public setCurrentShakeState(isDataInvalid: boolean): void {
    this.currentShakeState = isDataInvalid ? 'shake' : 'none';
    this.changeSiteIfNeccessary();
    this.resetShakeState();
  }
  get shakeState(): string {
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
