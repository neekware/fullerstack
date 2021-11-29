/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DeepReadonly } from 'ts-essentials';

import { CONFIG_TOKEN } from './config.default';
import { ApplicationConfig } from './config.model';
import { ConfigService } from './config.service';
import { remoteConfigFactory } from './config.util';

@NgModule({
  imports: [CommonModule],
})
export class ConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ConfigModule
  ) {
    if (parentModule) {
      /* istanbul ignore next */
      throw new Error('ConfigModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(options?: DeepReadonly<ApplicationConfig>): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [
        ConfigService,
        { provide: CONFIG_TOKEN, useValue: options },
        {
          provide: APP_INITIALIZER,
          useFactory: remoteConfigFactory,
          deps: [ConfigService],
          multi: true,
        },
      ],
    };
  }
}
