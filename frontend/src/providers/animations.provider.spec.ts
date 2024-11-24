import { TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { AnimationsProvider } from './animations.provider';

describe('AnimationsProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, NoopAnimationsModule],
    });
  });

  it('should have shake animation defined', () => {
    const shakeTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'shake'
    );
    expect(shakeTrigger).toBeDefined();
  });

  it('should have rotateCard animation defined', () => {
    const rotateCardTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'rotateCard'
    );
    expect(rotateCardTrigger).toBeDefined();
  });

  it('should have slideInOut animation defined', () => {
    const slideInOutTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'slideInOut'
    );
    expect(slideInOutTrigger).toBeDefined();
  });

  it('should have fadeInCenter animation defined', () => {
    const fadeInCenterTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'fadeInCenter'
    );
    expect(fadeInCenterTrigger).toBeDefined();
  });

  it('should have pulseAnimation defined', () => {
    const pulseAnimationTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'pulseAnimation'
    );
    expect(pulseAnimationTrigger).toBeDefined();
  });

  it('should have slideInFromTop animation defined', () => {
    const slideInFromTopTrigger = AnimationsProvider.animations?.find(
      (animation) => animation.name === 'slideInFromTop'
    );
    expect(slideInFromTopTrigger).toBeDefined();
  });
});
