import { TestBed } from '@angular/core/testing';

import { GqlInterceptor } from './gql.interceptor';

describe('GqlInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [GqlInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: GqlInterceptor = TestBed.inject(GqlInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
