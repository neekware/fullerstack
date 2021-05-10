import {
  AnimationTriggerMetadata,
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const shakeAnimations: {
  readonly wiggleIt: AnimationTriggerMetadata;
} = {
  wiggleIt: trigger('wiggleIt', [
    transition(
      '* => *',
      animate(
        300,
        keyframes([
          style({ transform: 'rotate(0)' }),
          style({ transform: 'rotate(-45deg)' }),
          style({ transform: 'rotate(-0deg)' }),
          style({ transform: 'rotate(-45deg)' }),
          style({ transform: 'rotate(0deg)' }),
        ])
      )
    ),
  ]),
};
