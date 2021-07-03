/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { GqlModule } from '@fullerstack/ngx-gql';
import { makeMockI18nModule } from '@fullerstack/ngx-i18n/mock';
import { JwtModule } from '@fullerstack/ngx-jwt';
import { LogLevel, LoggerModule } from '@fullerstack/ngx-logger';
import { MsgModule } from '@fullerstack/ngx-msg';
import { StoreModule } from '@fullerstack/ngx-store';

import { AuthAnonymousGuard } from './auth-anonymous.guard';
import { AuthModule } from './auth.module';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  logger: { level: LogLevel.trace },
  gql: { endpoint: '/graphql' },
};

// disable console log during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('AuthAnonymousGuard', () => {
  let service: AuthAnonymousGuard;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          ConfigModule.forRoot(environment),
          LoggerModule,
          ...makeMockI18nModule(),
          JwtModule,
          GqlModule,
          MsgModule,
          AuthModule,
          StoreModule,
        ],
        providers: [AuthAnonymousGuard],
      });

      service = TestBed.inject(AuthAnonymousGuard);
    })
  );

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
