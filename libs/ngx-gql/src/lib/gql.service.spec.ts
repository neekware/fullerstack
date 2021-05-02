import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { Apollo } from 'apollo-angular';

import { ConfigModule, ConfigService } from '@fullerstack/ngx-config';
import { LoggerModule, LoggerService } from '@fullerstack/ngx-logger';

import { GqlService } from './gql.service';

describe('GqlService', () => {
  let service: GqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ConfigModule.forRoot(), LoggerModule],
      providers: [Apollo, GqlService],
    });

    service = TestBed.inject(GqlService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
