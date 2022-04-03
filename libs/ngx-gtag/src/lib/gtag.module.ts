/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  imports: [CommonModule],
})
export class GTagModule {
  /**
   * Constructor - Ensures a singleton copy
   * @param parentModule parent module that imports the module
   */
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: GTagModule
  ) {
    if (parentModule) {
      throw new Error('GTagModule is already loaded. Import it in the AppModule only');
    }
  }
}
