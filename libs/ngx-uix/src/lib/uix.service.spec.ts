import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ConfigModule } from '@fullerstack/ngx-config';

import { UixModule } from './uix.module';
import { UixService } from './uix.service';

describe('UixService', () => {
  let service: UixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ConfigModule.forRoot(), UixModule],
      providers: [UixService],
    });

    service = TestBed.inject(UixService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
