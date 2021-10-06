/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const ANNOTATOR_STORAGE_KEY = 'annotator';
export const ANNOTATOR_URL = '/annotate';

/**
 * Layout config declaration
 */
export interface AnnotatorConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export interface LineAttributes {
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export interface AnnotatorState extends LineAttributes {
  signature: string;
  cursor: boolean;
  fullscreen: boolean;
  menuOptions: {
    showTrashButton: boolean;
    showUndoButton: boolean;
    showRedoButton: boolean;
    showLineWidthButton: boolean;
    showCursorButton: boolean;
    showFullscreenButton: boolean;
    showRefreshButton: boolean;
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  points: Point[];
  attributes: LineAttributes;
  visible?: boolean;
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

export type InputEvents = MouseEvent | TouchEvent;
