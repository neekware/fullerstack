import { HttpClientModule } from '@angular/common/http';
import { TestBed, getTestBed } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { DeepReadonly } from 'ts-essentials';

import { LogLevels } from './logger.model';
import { LoggerModule } from './logger.module';
import { LoggerService } from './logger.service';

const applicationConfig: DeepReadonly<ApplicationConfig> = {
  version: '1.0.0',
  appName: '@fullerstack/ngx-logger',
  production: false,
};

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('LoggerService: Loads default values, disabled', () => {
  let service: LoggerService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot(applicationConfig),
        LoggerModule.forRoot(),
      ],
    });

    testbed = getTestBed();
    service = testbed.inject(LoggerService);
  });

  afterAll(() => {
    testbed = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the app config options', () => {
    expect(service.config.options.appName).toBe(applicationConfig.appName);
  });

  it('should have the module default config options', () => {
    expect(service.options.logger.level).toBe(LogLevels.none);
  });

  it('should not log anything as the level is none', () => {
    const consoleLog = spyOn(console, 'log');
    service.critical('Logging a critical');
    service.error('Logging a error');
    service.info('Logging a info');
    service.debug('Logging a debug');
    service.trace('Logging a trace');
    expect(consoleLog).not.toHaveBeenCalled();
  });
});

describe('LoggerService: LogLevel tracing enabled', () => {
  let service: LoggerService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          ...applicationConfig,
          logger: { level: LogLevels.trace },
        }),
        LoggerModule.forRoot(),
      ],
    });

    testbed = getTestBed();
    service = testbed.inject(LoggerService);
  });

  afterAll(() => {
    testbed = null;
    service = null;
  });

  it('should log everything above, and including tracing', () => {
    const consoleLog = spyOn(console, 'log');
    service.critical('Logging a critical');
    service.error('Logging a error');
    service.info('Logging a info');
    service.debug('Logging a debug');
    service.trace('Logging a trace');
    expect(consoleLog).toHaveBeenCalledTimes(5);
  });
});

describe('LoggerService: LogLevel debug enabled', () => {
  let service: LoggerService;
  let testbed: TestBed;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          ...applicationConfig,
          logger: { level: LogLevels.debug },
        }),
        LoggerModule.forRoot(),
      ],
    });

    testbed = getTestBed();
    service = testbed.inject(LoggerService);
  });

  afterAll(() => {
    testbed = null;
    service = null;
  });

  it('should log everything above, and including debug', () => {
    const consoleLog = spyOn(console, 'log');
    service.critical('Logging a critical');
    service.error('Logging a error');
    service.info('Logging a info');
    service.debug('Logging a debug');
    service.trace('Logging a trace');
    expect(consoleLog).toHaveBeenCalledTimes(4);
  });
});
