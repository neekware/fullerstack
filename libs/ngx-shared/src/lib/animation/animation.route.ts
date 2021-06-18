/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  AnimationTriggerMetadata,
  animate,
  group,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeAnimations: {
  readonly slideIn: AnimationTriggerMetadata;
  readonly smoothIn: AnimationTriggerMetadata;
  readonly smoothSwap: AnimationTriggerMetadata;
} = {
  slideIn: trigger('slideIn', [
    transition('* <=> *', [
      query(
        // enter new route state
        ':enter',
        style({ position: 'fixed', width: '100%', transform: 'translateX(-100%)' }),
        { optional: true }
      ),
      query(
        // move outlet off screen (-> right)
        ':leave',
        animate(
          '.3s ease',
          style({ position: 'fixed', width: '100%', transform: 'translateX(100%)' })
        ),
        {
          optional: true,
        }
      ),
      query(
        // move outlet in screen (<- right)
        ':enter',
        animate('.3s ease', style({ opacity: 1, transform: 'translateX(0%)' })),
        { optional: true }
      ),
    ]),
  ]),
  smoothIn: trigger('smoothIn', [
    transition('* <=> *', [
      query(':enter > *', style({ opacity: 0, position: 'fixed' }), { optional: true }),
      query(':enter', style({ opacity: 0 }), { optional: true }),
      sequence([
        query(
          ':leave > *',
          [
            style({ opacity: 1 }),
            animate('0.2s ease-out', style({ opacity: 0 })),
            style({ position: 'fixed' }),
          ],
          { optional: true }
        ),
        query(
          ':enter > *',
          [
            style({ opacity: 0, position: 'static' }),
            animate('0.2s ease-out', style({ opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
      query(
        ':enter',
        stagger(100, [style({ opacity: 0 }), animate('0.2s ease-out', style({ opacity: 1 }))]),
        { optional: true }
      ),
    ]),
  ]),
  smoothSwap: trigger('smoothSwap', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'fixed', opacity: 1 })),
      group([
        query(':enter', [style({ opacity: 0 }), animate('600ms ease-out', style({ opacity: 1 }))]),
        query(':leave', [style({ opacity: 1 }), animate('600ms ease-out', style({ opacity: 0 }))], {
          optional: true,
        }),
      ]),
    ]),
  ]),
};
