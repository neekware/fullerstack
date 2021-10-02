/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { render } from '@testing-library/react';

import Menu from './menu';

describe('Menu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Menu />);
    expect(baseElement).toBeTruthy();
  });
});
