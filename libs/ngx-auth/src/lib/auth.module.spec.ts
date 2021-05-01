import { waitForAsync, TestBed } from '@angular/core/testing';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AuthModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(AuthModule).toBeDefined();
  });
});
