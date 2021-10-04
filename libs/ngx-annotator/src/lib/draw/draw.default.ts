/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DefaultAnnotatorState } from '../annotator.default';
import { Line } from './draw.model';
import { CanvasButtonAttributes } from './draw.model';

export const CANVAS_MIN_POINTS_TO_DRAW = 6;

export const DefaultCanvasButtonAttributes: CanvasButtonAttributes = {
  canvas: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    border: 0,
  },
  button: {
    zIndex: 2,
    color: 'primary',
    top: 0,
    right: 0,
    bottom: 'unset',
    left: 'unset',
    position: 'absolute',
  },
};

export const DefaultLine: Line = {
  points: [],
  attributes: {
    lineCap: DefaultAnnotatorState.lineCap,
    lineWidth: DefaultAnnotatorState.lineWidth,
    strokeStyle: DefaultAnnotatorState.strokeStyle,
  },
  visible: false,
};
