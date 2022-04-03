/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { DeepReadonly } from 'ts-essentials';

import { DEFAULT_HTTP_TIMEOUT } from './config.constant';
import { ApplicationConfig, HttpMethod } from './config.model';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

/** Application Environment with no remote config endpoint */
const appEnvLocal: DeepReadonly<ApplicationConfig> = {
  version: '1.0.1',
  production: true,
};

/** Application Environment with remote config endpoint */
const appEnvRemote: DeepReadonly<ApplicationConfig> = {
  version: '1.0.1',
  production: true,
  remoteConfig: {
    endpoint: 'http://foo.com/remote/config',
  },
};

/** Mocked config config from remote endpoint */
const mockRemoteData = {
  country: 'US',
  state: 'California',
  splash: 'https://foo.com/authenticated.gif',
} as const;

// disable console log/warn during test
// jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('ConfigService: loading and defaults', () => {
  let service: ConfigService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConfigModule.forRoot(appEnvLocal)],
      providers: [ConfigService],
    });

    testbed = getTestBed();
    service = testbed.inject(ConfigService);
  });

  afterAll(() => {
    testbed = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should have the version options', () => {
    expect(service.options.version).toBe('1.0.1');
  });

  it('should have merged the default config options', () => {
    expect(service.options.localConfig.loginPageUrl).toBe('/auth/login');
  });

  it('should have merged the default options with the remote options', () => {
    expect(service.options.remoteConfig.timeout).toEqual(DEFAULT_HTTP_TIMEOUT);
  });

  it('should handle null remoteConfig endpoints', () => {
    expect(service.options.remoteConfig.endpoint).toEqual(null);

    service.fetchRemoteConfig().then(() => {
      expect(service.options.remoteData).toEqual({});
    });
  });
});

describe('ConfigService: remoteConfig via GET', () => {
  let service: ConfigService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConfigModule.forRoot(appEnvRemote)],
      providers: [ConfigService],
    });

    testbed = getTestBed();
    service = testbed.inject(ConfigService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config via GET', () => {
    expect(service.options.remoteConfig.method).toBe(HttpMethod.GET);
    const mockReq = httpMock.expectOne(service.options.remoteConfig.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });

  it('should get remote config handle Error on GET calls', () => {
    const mockReq = httpMock.expectOne(service.options.remoteConfig.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});

describe('ConfigService: remoteConfig via POST', () => {
  let service: ConfigService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ConfigModule.forRoot({
          ...appEnvRemote,
          remoteConfig: {
            ...appEnvRemote.remoteConfig,
            method: HttpMethod.POST,
          },
        }),
      ],
      providers: [ConfigService],
    });

    testbed = getTestBed();
    service = testbed.inject(ConfigService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config via POST', () => {
    expect(service.options.remoteConfig.method).toBe(HttpMethod.POST);
    const mockReq = httpMock.expectOne(service.options.remoteConfig.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });

  it('should get remote config handle Error on POST calls', () => {
    const mockReq = httpMock.expectOne(service.options.remoteConfig.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});

describe('ConfigService: remoteConfig w/o headers', () => {
  let service: ConfigService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ConfigModule.forRoot({
          ...appEnvRemote,
          remoteConfig: { ...appEnvRemote.remoteConfig, headers: {} },
        }),
      ],
      providers: [ConfigService],
    });

    testbed = getTestBed();
    service = testbed.inject(ConfigService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config in dev mode w/o headers', () => {
    const mockReq = httpMock.expectOne(service.options.remoteConfig.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });
});
