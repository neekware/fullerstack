import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';

import { LoggerModule } from '@fullerstack/ngx-logger';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { JwtModule } from '@fullerstack/ngx-jwt';
import { MsgModule } from '@fullerstack/ngx-msg';
import { AuthModule } from '@fullerstack';
import { AuthEffect } from './auth-state.effect';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('Auth: AuthEffect', () => {
  let service: AuthEffect;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        NgxsModule.forRoot([]),
        NgxsModule.forFeature([]),
        ConfigModule.forRoot(environment),
        LoggerModule,
        JwtModule,
        // GqlModule,
        MsgModule,
        AuthModule,
      ],
      providers: [AuthEffect],
    });

    service = TestBed.inject(AuthEffect);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
