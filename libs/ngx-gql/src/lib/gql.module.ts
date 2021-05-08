import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { GqlService } from './gql.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [GqlService],
})
export class GqlModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: GqlModule
  ) {
    if (parentModule) {
      throw new Error(
        'GqlModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
