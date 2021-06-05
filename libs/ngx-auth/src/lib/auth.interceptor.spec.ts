import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { AuthEffectsService } from './store/auth-state.effect';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: AuthEffectsService,
          useValue: {},
        },
      ],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
