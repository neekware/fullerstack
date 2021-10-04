/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface Point {
  x: number;
  y: number;
  visible?: boolean;
}

export interface Line {
  points: Point[];
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: string;
}

export interface CanvasButtonAttributes {
  canvas: {
    zIndex: number | string;
    width: number | string;
    height: number | string;
    border: number | string;
  };
  button: {
    zIndex: number | string;
    color?: number | string;
    top?: number | string;
    left?: number | string;
    bottom?: number | string;
    right?: number | string;
    position?: number | string;
  };
}
