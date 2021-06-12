/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultGqlConfig } from './gql.default';

@Injectable({ providedIn: 'root' })
export class GqlService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(
    readonly http: HttpClient,
    readonly config: ConfigService,
    readonly logger: LoggerService
  ) {
    this.options = ldNestedMerge({ gql: DefaultGqlConfig }, this.config.options);
    logger.info('GqlService ready ...');
  }
}
