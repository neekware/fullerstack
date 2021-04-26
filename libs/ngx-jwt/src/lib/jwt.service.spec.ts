/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, getTestBed } from '@angular/core/testing';
import { isMatch as ldIsMatch } from 'lodash-es';

import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

import { JwtModule } from './jwt.module';
import { JwtService } from './jwt.service';
import { HttpClientModule } from '@angular/common/http';
import { DeepReadonly } from 'ts-essentials';

const validToken = () => {
  // eslint:disable-next-line
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJOZWVrd2FyZSBKV1QgQXV0aG9yaXR5ICIsImlhdCI6MjUyOTk0NzU2OSwiZXhwIjoyNTMyNjI1OTY5LCJhdWQiOiJ3d3cubmVla3dhcmUuY29tIiwic3ViIjoiMjIifQ.05FqKNyDJSGceqjUPF0DhI8lLsEYF_2mzHbEvP6MUu8';
};

const expiredToken = () => {
  // eslint:disable-next-line
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJOZWVrd2FyZSBKV1QgQXV0aG9yaXR5ICIsImlhdCI6Mjg5MzM2MzY5LCJleHAiOjI5MjAxNDc2OSwiYXVkIjoid3d3Lm5lZWt3YXJlLmNvbSIsInN1YiI6IjIyIn0.aONSjDJrnVBbzeWeTt7Rs9WIb-SWuN99XgK5Lo6dKGo';
};

const validPayload = () => {
  return {
    // Identifier (or, name) of the server or system issuing the token
    iss: 'Neekware JWT Authority ',
    // Date/time when the token was issued.
    iat: 2529947569, // 2050-03-03T19:12:49.785Z
    // Date/time at which point the token is no longer valid.
    exp: 2532625969, // 2050-04-03T19:12:49.785Z
    // Intended recipient of this token; recipient uses it when validating the token.
    aud: 'www.neekware.com',
    // Identifier (or, name) of the user this token represents. (user id)
    sub: '22',
  };
};

// const expiredPayload = () => {
//   return {
//     ...validPayload(),
//     ...{
//       iat: 289336369, // 1979-03-03T19:12:49.785Z
//       exp: 292014769, // 1979-04-03T19:12:49.785Z
//     },
//   };
// };

const applicationConfig: DeepReadonly<ApplicationConfig> = {
  version: '1.0.0',
  appName: '@fullerstack/ngx-jwt',
  production: false,
};

describe('JwtService', () => {
  let service: JwtService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot(applicationConfig),
        LoggerModule,
        JwtModule,
      ],
      providers: [JwtModule],
    });

    testbed = getTestBed();
    service = testbed.inject(JwtService);
  });

  afterAll(() => {
    testbed = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with default values', () => {
    expect(service.options.jwt.networkDelay).toBe(1);
  });

  it('should detect invalid token', () => {
    const token = expiredToken();
    const payload = service.getPayload(token);
    expect(service.isExpired(payload)).toBe(true);
  });

  it('should get payload from token', () => {
    const token = validToken();
    const payload = service.getPayload(token);
    expect(ldIsMatch(payload, validPayload())).toEqual(true);
  });

  it('should verify expiry on a valid token', () => {
    const token = validToken();
    const payload = service.getPayload(token);
    const isExpired = service.isExpired(payload);
    expect(isExpired).toBe(false);
  });

  it('should verify expiry on a null token', () => {
    const token = null;
    const payload = service.getPayload(token);
    const isExpired = service.isExpired(payload);
    expect(isExpired).toBe(true);
  });

  it('should verify expiry on a token with missing parts', () => {
    const token = 'part1.part2';
    const payload = service.getPayload(token);
    const isExpired = service.isExpired(payload);
    expect(isExpired).toBe(true);
  });

  it('should verify refresh time on a valid token', () => {
    const token = validToken();
    const payload = service.getPayload(token);
    const refresh = service.getRefreshTime(payload);
    expect(refresh).toBeGreaterThan(0);
  });
});
