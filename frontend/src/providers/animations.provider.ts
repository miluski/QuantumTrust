import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export class AnimationsProvider {
  static animations: any[] | undefined = [
    trigger('shake', [
      transition('* => shake', [
        animate(
          '0.5s',
          keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-5px)', offset: 0.1 }),
            style({ transform: 'translateX(5px)', offset: 0.2 }),
            style({ transform: 'translateX(-5px)', offset: 0.3 }),
            style({ transform: 'translateX(5px)', offset: 0.4 }),
            style({ transform: 'translateX(-5px)', offset: 0.5 }),
            style({ transform: 'translateX(5px)', offset: 0.6 }),
            style({ transform: 'translateX(-5px)', offset: 0.7 }),
            style({ transform: 'translateX(5px)', offset: 0.8 }),
            style({ transform: 'translateX(-5px)', offset: 0.9 }),
            style({ transform: 'translateX(0)', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('rotateCard', [
      state('front', style({ transform: 'rotateY(0)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front => back', [animate('0.6s')]),
      transition('back => front', [animate('0.6s')]),
    ]),
    trigger('slideInOut', [
      state(
        'in',
        style({
          borderBottomWidth: '2px',
          borderBottomColor: 'white',
        })
      ),
      state(
        'out',
        style({
          borderBottomWidth: '0px',
          borderBottomColor: 'transparent',
        })
      ),
      transition('out => in', [
        style({ borderBottomWidth: '0px', borderBottomColor: 'transparent' }),
        animate(
          '500ms ease-in',
          style({ borderBottomWidth: '2px', borderBottomColor: 'white' })
        ),
      ]),
      transition('in => out', [
        style({ borderBottomWidth: '2px', borderBottomColor: 'white' }),
        animate(
          '500ms ease-out',
          style({ borderBottomWidth: '0px', borderBottomColor: 'transparent' })
        ),
      ]),
    ]),
    trigger('fadeInCenter', [
      state('center', style({ opacity: 1 })),
      state('default', style({ opacity: 0.3 })),
      transition('default => center', [
        style({ opacity: 0 }),
        animate('1.5s ease-out'),
      ]),
    ]),
    trigger('pulseAnimation', [
      state('start', style({ transform: 'scale(1)' })),
      state('end', style({ transform: 'scale(1.2)' })),
      transition('start <=> end', animate('1s ease-in-out')),
    ]),
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ];
}
