import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { GqlService } from './gql.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
    GqlService,
  ],
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
