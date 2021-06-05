import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { JwtModule } from '@fullerstack/ngx-jwt';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { MsgModule } from '@fullerstack/ngx-msg';
import { NgxsModule } from '@ngxs/store';
import { AuthModule } from '../auth.module';

import { AuthEffectsService } from './auth-state.effect';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('Auth: AuthEffectsService', () => {
  let service: AuthEffectsService;

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
      providers: [AuthEffectsService],
    });

    service = TestBed.inject(AuthEffectsService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
