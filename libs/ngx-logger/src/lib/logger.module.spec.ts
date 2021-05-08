import { TestBed, waitForAsync } from '@angular/core/testing';

import { LoggerModule } from './logger.module';

describe('LoggerModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [LoggerModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(LoggerModule).toBeDefined();
  });
});
