import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

import { GTagModule } from './gtag.module';
import { GTagService } from './gtag.service';

// disable console log during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('GTagService', () => {
  let service: GTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ConfigModule.forRoot(),
        LoggerModule,
        GTagModule,
      ],
      providers: [
        {
          provide: DOCUMENT,
          useValue: {},
        },
      ],
    });

    service = TestBed.inject(GTagService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
