/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CanvasMenuAttributes } from './menu.model';

export const DefaultCanvasMenuAttributes: CanvasMenuAttributes = {
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
