/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

export interface SubifyOptions {
  // name of subscription property consumed by takeUnit (e.g. destroy$)
  // example: .pipe(takeUnit(this.destroy$))
  takeUntilInputName?: string;
  // name of subscription properties automatically canceled on destroy
  includes?: string[];
  // name of subscription properties excluded from automatic canceling
  excludes?: string[];
  // class name
  className?: string;
}
