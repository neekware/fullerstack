import { waitForAsync, TestBed } from '@angular/core/testing';
import { GTagModule } from './gtag.module';

describe('GTagModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [GTagModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(GTagModule).toBeDefined();
  });
});
