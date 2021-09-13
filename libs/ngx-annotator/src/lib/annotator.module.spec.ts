import { TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotatorModule } from './annotator.module';

describe('AnnotatorService', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AnnotatorModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(AnnotatorModule).toBeDefined();
  });
});
