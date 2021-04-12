import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepReadonly } from 'ts-essentials';
import { ApplicationConfig } from './config.models';
import { ConfigService } from './config.service';
import { CONFIG_TOKEN } from './config.defaults';
import { remoteConfigFactory } from './config.utils';

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
      throw new Error(
        'ConfigModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(options?: DeepReadonly<ApplicationConfig>) {
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
