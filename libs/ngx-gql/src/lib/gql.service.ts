/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApolloLink,
  FetchResult,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  from as combineLinks,
} from '@apollo/client/core';
import { RetryLink } from '@apollo/client/link/retry';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable, from } from 'rxjs';
import { first } from 'rxjs/operators';
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

  query<T = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, T>
  ): Observable<FetchResult<T>> {
    return from(this.apollo.client.query<T, TVariables>(options)).pipe(first());
  }

  mutate<T = any, TVariables = OperationVariables>(
    options: MutationOptions<T, TVariables>
  ): Observable<FetchResult<T>> {
    return from(this.apollo.client.mutate<T, TVariables>(options)).pipe(first());
  }

  promoteError(refreshRequestAction: () => Observable<any>) {
    const errorConverterLink = new ApolloLink((operation, forward) => {
      return forward(operation).map((data) => {
        if (data?.errors?.length > 0) {
          for (const error of data?.errors) {
            const { exception } = error?.extensions;
            if (exception?.status === HttpStatusCode.Unauthorized) {
              refreshRequestAction();
              const error = new Error(exception?.message);
              error.stack = exception?.stacktrace;
              error['status'] = exception?.status;
              throw error;
            }
          }
        }
        return data;
      });
    });
    this.apollo.client.setLink(
      combineLinks([this.setupMiddleware(), errorConverterLink, this.getMainLink()])
    );
  }

  private setupMiddleware() {
    const retryMiddleware = new RetryLink({
      delay: {
        initial: 300,
      },
      attempts: {
        max: 2,
        retryIf: async (error, operation) => {
          switch (operation.operationName) {
            case 'AuthRefreshTokenMutation':
            case 'AuthLogoutMutation':
              return false;
          }

          if (error.status === HttpStatusCode.Unauthorized) {
            return true;
          }
          return false;
        },
      },
    });
    return retryMiddleware;
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
      link: combineLinks([this.setupMiddleware(), this.getMainLink()]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    });
  }
}
