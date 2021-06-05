import { Injectable } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultGqlConfig, GQL_CLIENT_NAME } from './gql.default';

@Injectable({ providedIn: 'root' })
export class GqlService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly apollo: Apollo,
    readonly httpLink: HttpLink
  ) {
    this.options = ldNestedMerge({ gql: DefaultGqlConfig }, this.config.options);

    this.setupApolloClient();
    logger.info('GqlService ready ...');
  }

  private getMainLink(): HttpLinkHandler {
    const httpLink = this.httpLink.create({
      uri: this.options.gql.endpoint,
      withCredentials: true,
    });
    return httpLink;
  }

  private setupApolloClient() {
    this.apollo.create({
      name: GQL_CLIENT_NAME,
      link: this.getMainLink(),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      },
    });
  }

  get client() {
    return this.apollo.client;
  }
}
