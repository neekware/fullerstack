/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AutocompleteDirective } from './autocomplete.directive';

describe('AutocompleteDirective', () => {
  it('should create an instance', () => {
    const directive = new AutocompleteDirective('off');
    expect(directive).toBeTruthy();
  });
});
