/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LogLevel } from '@fullerstack/ngx-logger';

import { LoggerInterceptor } from './logger.interceptor';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  logger: { level: LogLevel.trace },
  gql: { endpoint: '/graphql' },
};

describe('LoggerInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConfigModule.forRoot(environment)],
      providers: [LoggerInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: LoggerInterceptor = TestBed.inject(LoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
