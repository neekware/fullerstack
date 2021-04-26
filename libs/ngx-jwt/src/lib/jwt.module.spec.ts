import { waitForAsync, TestBed } from '@angular/core/testing';
import { JwtModule } from './jwt.module';

describe('JwtModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [JwtModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(JwtModule).toBeDefined();
  });
});
