import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationCfg } from './cfg.models';
import { CfgService } from './cfg.service';
import { CFG_TOKEN } from './cfg.defaults';
import { remoteCfgFactory } from './cfg.utils';
@NgModule({
  imports: [CommonModule],
})
export class CfgModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CfgModule
  ) {
    if (parentModule) {
      throw new Error(
        'CfgModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(options?: ApplicationCfg) {
    return {
      ngModule: CfgModule,
      providers: [
        CfgService,
        { provide: CFG_TOKEN, useValue: options },
        {
          provide: APP_INITIALIZER,
          useFactory: remoteCfgFactory,
          deps: [CfgService],
          multi: true,
        },
      ],
    };
  }
}
