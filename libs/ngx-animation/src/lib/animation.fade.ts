import {
  AnimationTriggerMetadata,
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FADE_ANIMATION_TIMING = '.5s cubic-bezier(0.4,0.0,0.2,1)';

export const fadeAnimations: {
  readonly fadeOutInSlow: AnimationTriggerMetadata;
} = {
  fadeOutInSlow: trigger('fadeOutInSlow', [
    transition(
      '* => *',
      animate(
        FADE_ANIMATION_TIMING,
        keyframes([style({ opacity: 1 }), style({ opacity: 0.95 }), style({ opacity: 1 })])
      )
    ),
  ]),
};
