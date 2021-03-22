import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DEFAULT_HTTP_TIMEOUT } from './cfg.constants';
import { ApplicationCfg, HttpMethod } from './cfg.models';
import { CfgModule } from './cfg.module';
import { CfgService } from './cfg.service';

/** Application Environment with no remote config endpoint */
const appEnvLocal: Readonly<ApplicationCfg> = {
  version: '1.0.1',
  production: true,
};

/** Application Environment with remote config endpoint */
const appEnvRemote: Readonly<ApplicationCfg> = {
  version: '1.0.1',
  production: true,
  remoteCfg: {
    endpoint: 'http://foo.com/remote/cfg',
  },
};

/** Mocked config config from remote endpoint */
const mockRemoteData = {
  country: 'US',
  state: 'California',
  splash: 'https://foo.com/authenticated.gif',
};

// disable console log/warn during test
// jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('CfgService: loading and defaults', () => {
  let service: CfgService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CfgModule.forRoot(appEnvLocal)],
      providers: [CfgService],
    });

    testbed = getTestBed();
    service = testbed.inject(CfgService);
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
    expect(service.options.localCfg.loginPageUrl).toBe('/auth/login');
  });

  it('should have merged the default options with the remote options', () => {
    expect(service.options.remoteCfg.timeout).toEqual(DEFAULT_HTTP_TIMEOUT);
  });

  it('should handle null remoteCfg endpoints', () => {
    expect(service.options.remoteCfg.endpoint).toEqual(null);

    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual({});
    });
  });
});

describe('CfgService: remoteCfg via GET', () => {
  let service: CfgService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CfgModule.forRoot(appEnvRemote)],
      providers: [CfgService],
    });

    testbed = getTestBed();
    service = testbed.inject(CfgService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config via GET', () => {
    expect(service.options.remoteCfg.method).toBe(HttpMethod.GET);
    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });

  it('should get remote config handle Error on GET calls', () => {
    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});

describe('CfgService: remoteCfg via POST', () => {
  let service: CfgService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CfgModule.forRoot({
          ...appEnvRemote,
          remoteCfg: { ...appEnvRemote.remoteCfg, method: HttpMethod.POST },
        }),
      ],
      providers: [CfgService],
    });

    testbed = getTestBed();
    service = testbed.inject(CfgService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config via POST', () => {
    expect(service.options.remoteCfg!.method).toBe(HttpMethod.POST);
    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });

  it('should get remote config handle Error on POST calls', () => {
    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});

describe('CfgService: remoteCfg w/o headers', () => {
  let service: CfgService;
  let testbed: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CfgModule.forRoot({
          ...appEnvRemote,
          remoteCfg: { ...appEnvRemote.remoteCfg, headers: {} },
        }),
      ],
      providers: [CfgService],
    });

    testbed = getTestBed();
    service = testbed.inject(CfgService);
    httpMock = testbed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    testbed = null;
    service = null;
    httpMock = null;
  });

  it('should get remote config in dev mode w/o headers', () => {
    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });
});
