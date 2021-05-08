import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
// import { fakeLocalStorage } from '@nwpkg/tests/storage/mock.storage';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { JwtModule } from '@fullerstack/ngx-jwt';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { MsgModule } from '@fullerstack/ngx-msg';
import { NgxsModule } from '@ngxs/store';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('AuthService', () => {
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
      providers: [AuthService],
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
