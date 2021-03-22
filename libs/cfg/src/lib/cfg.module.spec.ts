import { waitForAsync, TestBed } from '@angular/core/testing';
import { CfgModule } from './cfg.module';

describe('CfgModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CfgModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(CfgModule).toBeDefined();
  });
});
