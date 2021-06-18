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
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const ROTATION_ANIMATION_TIMING = '300ms cubic-bezier(0.4,0.0,0.2,1)';

export const rotationAnimations: {
  readonly rotate90: AnimationTriggerMetadata;
  readonly rotate180: AnimationTriggerMetadata;
  readonly rotate270: AnimationTriggerMetadata;
  readonly rotate360: AnimationTriggerMetadata;
} = {
  rotate90: trigger('rotate90', [
    state('back', style({ transform: 'rotate(0)' })),
    state('forth', style({ transform: 'rotate(-180deg)' })),
    transition('forth => back', animate(ROTATION_ANIMATION_TIMING)),
    transition('back => forth', animate(ROTATION_ANIMATION_TIMING)),
  ]),
  rotate180: trigger('rotate180', [
    state('back', style({ transform: 'rotate(0)' })),
    state('forth', style({ transform: 'rotate(-180deg)' })),
    transition('forth => back', animate(ROTATION_ANIMATION_TIMING)),
    transition('back => forth', animate(ROTATION_ANIMATION_TIMING)),
  ]),
  rotate270: trigger('rotate270', [
    state('back', style({ transform: 'rotate(0)' })),
    state('forth', style({ transform: 'rotate(-270deg)' })),
    transition('forth => back', animate(ROTATION_ANIMATION_TIMING)),
    transition('back => forth', animate(ROTATION_ANIMATION_TIMING)),
  ]),
  rotate360: trigger('rotate360', [
    state('back', style({ transform: 'rotate(0)' })),
    state('forth', style({ transform: 'rotate(-360deg)' })),
    transition('forth => back', animate(ROTATION_ANIMATION_TIMING)),
    transition('back => forth', animate(ROTATION_ANIMATION_TIMING)),
  ]),
};
