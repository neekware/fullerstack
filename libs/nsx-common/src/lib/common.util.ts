/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface getAssetOption {
  stripNextLine?: boolean;
}

const assetCache: { [id: string]: string } = {};

export function getAsset(filePath: string, options?: getAssetOption): string {
  options = { stripNextLine: false, ...options };
  if (assetCache[filePath]) {
    return assetCache[filePath];
  } else {
    let fileData = readFileSync(join(__dirname, join('assets', filePath)), 'utf-8');
    if (options.stripNextLine) {
      fileData = fileData.replace(/\r?\n|\r/g, '');
    }
    assetCache[filePath] = fileData;
    return fileData;
  }
}

export function fileExists(filePath: string): boolean {
  try {
    if (existsSync(filePath)) {
      return true;
    }
  } catch (err) {
    /*pass*/
  }
  return false;
}
