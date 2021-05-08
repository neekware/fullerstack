import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

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
      throw new Error(
        'LoggerModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot() {
    return {
      ngModule: LoggerModule,
      providers: [LoggerService],
    };
  }
}
