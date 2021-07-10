/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const assetCache: { [id: string]: string } = {};

export function getAsset(filePath: string): string {
  if (assetCache[filePath]) {
    return assetCache[filePath];
  } else {
    const fileData = readFileSync(join(__dirname, join('assets', filePath)), 'utf-8');
    assetCache[filePath] = fileData;
    return fileData;
  }
}
