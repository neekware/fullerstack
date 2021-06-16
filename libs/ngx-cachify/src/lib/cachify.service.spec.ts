import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigModule } from '@fullerstack/ngx-config';

import { CachifyModule } from './cachify.module';
import { CachifyService } from './cachify.service';

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('CachifyService', () => {
  let service: CachifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          production: false,
        }),
        CachifyModule,
      ],
    });

    service = TestBed.inject(CachifyService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
