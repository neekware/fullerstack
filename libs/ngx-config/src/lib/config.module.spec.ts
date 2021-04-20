import { waitForAsync, TestBed } from '@angular/core/testing';
import { ConfigModule } from './config.module';

describe('ConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ConfigModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(ConfigModule).toBeDefined();
  });
});
