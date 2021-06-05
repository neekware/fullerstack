import { TestBed, waitForAsync } from '@angular/core/testing';

import { UtilModule } from './util.module';

describe('UtilModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UtilModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(UtilModule).toBeDefined();
  });
});
