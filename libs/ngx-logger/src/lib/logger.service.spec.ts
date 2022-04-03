/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { HttpClientModule } from '@angular/common/http';
import { TestBed, getTestBed } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { DeepReadonly } from 'ts-essentials';

import { LogLevel } from './logger.model';
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
      imports: [HttpClientModule, ConfigModule.forRoot(applicationConfig), LoggerModule.forRoot()],
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
    expect(service.options.logger.level).toBe(LogLevel.none);
  });

  it('should not log anything as the level is none', () => {
    console.log = jest.fn();
    const consoleLog = jest.spyOn(console, 'log');
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
  const log = console.log;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          ...applicationConfig,
          logger: { level: LogLevel.trace },
        }),
        LoggerModule.forRoot(),
      ],
    });

    testbed = getTestBed();
    service = testbed.inject(LoggerService);
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = log;
    testbed = null;
    service = null;
  });

  it('should log everything above, and including tracing', () => {
    service.critical('Logging a critical');
    service.error('Logging a error');
    service.info('Logging a info');
    service.debug('Logging a debug');
    service.trace('Logging a trace');
    expect(console.log).toHaveBeenCalledTimes(5);
  });
});

describe('LoggerService: LogLevel debug enabled', () => {
  let service: LoggerService;
  let testbed: TestBed;
  const log = console.log;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          ...applicationConfig,
          logger: { level: LogLevel.debug },
        }),
        LoggerModule.forRoot(),
      ],
    });

    testbed = getTestBed();
    service = testbed.inject(LoggerService);
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = log;
    testbed = null;
    service = null;
  });

  jest.spyOn(console, 'log');

  it('should log everything above, and including debug', () => {
    service.critical('Logging a critical');
    service.error('Logging a error');
    service.info('Logging a info');
    service.debug('Logging a debug');
    service.trace('Logging a trace');
    expect(console.log).toHaveBeenCalledTimes(4);
  });
});
