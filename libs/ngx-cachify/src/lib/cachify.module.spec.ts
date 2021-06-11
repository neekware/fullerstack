import { TestBed, waitForAsync } from '@angular/core/testing';

import { CachifyModule } from './cachify.module';

describe('CachifyModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CachifyModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(CachifyModule).toBeDefined();
  });
});
