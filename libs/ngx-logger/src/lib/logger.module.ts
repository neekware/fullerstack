/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { LoggerService } from './logger.service';

@NgModule({
  imports: [CommonModule],
})
export class LoggerModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: LoggerModule
  ) {
    if (parentModule) {
      /* istanbul ignore next */
      throw new Error('LoggerModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [LoggerService],
    };
  }
}
