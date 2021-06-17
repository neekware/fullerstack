import { TestBed } from '@angular/core/testing';

import { AuthAuthenticatedGuard } from './auth-authenticated.guard';

describe('AuthAuthenticatedGuard', () => {
  let guard: AuthAuthenticatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthAuthenticatedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
