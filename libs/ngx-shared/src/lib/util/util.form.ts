/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { FormControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';

export function getControl(name: string): FormControl {
  return tryGet<FormControl>(() => this.form.controls[name] as FormControl);
}
