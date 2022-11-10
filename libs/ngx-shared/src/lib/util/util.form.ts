/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { UntypedFormControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';

export function getControl(name: string): UntypedFormControl {
  return tryGet<UntypedFormControl>(() => this.form.controls[name] as UntypedFormControl);
}
