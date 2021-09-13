import { TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotateModule } from './annotate.module';

describe('AnnotateModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AnnotateModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(AnnotateModule).toBeDefined();
  });
});
