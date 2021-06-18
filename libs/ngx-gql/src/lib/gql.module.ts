/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { GqlService } from './gql.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class GqlModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: GqlModule
  ) {
    if (parentModule) {
      throw new Error('GqlModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot() {
    return {
      ngModule: GqlModule,
      providers: [GqlService],
    };
  }
}
