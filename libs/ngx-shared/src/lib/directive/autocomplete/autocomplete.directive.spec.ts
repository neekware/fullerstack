/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { AutocompleteDirective } from './autocomplete.directive';

describe('AutocompleteDirective', () => {
  it('should create an instance', () => {
    const directive = new AutocompleteDirective('off');
    expect(directive).toBeTruthy();
  });
});
