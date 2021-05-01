import { waitForAsync, TestBed } from '@angular/core/testing';
import { LayoutModule } from './layout.module';

describe('LayoutModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [LayoutModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(LayoutModule).toBeDefined();
  });
});
