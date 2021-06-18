/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { MenuModule } from './menu.module';

describe('MenuModule', () => {
  let menuModule: MenuModule;

  beforeEach(() => {
    menuModule = new MenuModule();
  });

  it('should create an instance', () => {
    expect(menuModule).toBeTruthy();
  });
});
