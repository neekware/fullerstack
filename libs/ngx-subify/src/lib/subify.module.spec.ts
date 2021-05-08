import { TestBed, waitForAsync } from '@angular/core/testing';

import { SubifyModule } from './subify.module';

describe('SubifyModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SubifyModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(SubifyModule).toBeDefined();
  });
});
