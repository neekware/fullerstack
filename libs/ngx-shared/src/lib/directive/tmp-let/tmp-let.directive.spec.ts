/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { TmpLetDirective } from './tmp-let.directive';

xdescribe('TmpLetDirective', () => {
  it('should create an instance', () => {
    const directive = new TmpLetDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
