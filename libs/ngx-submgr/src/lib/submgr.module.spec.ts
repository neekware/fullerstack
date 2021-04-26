import { waitForAsync, TestBed } from '@angular/core/testing';
import { SubMgrModule } from './submgr.module';

describe('SubMgrModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SubMgrModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(SubMgrModule).toBeDefined();
  });
});
