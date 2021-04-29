import { waitForAsync, TestBed } from '@angular/core/testing';
import { MsgModule } from './msg.module';

describe('MsgModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MsgModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(MsgModule).toBeDefined();
  });
});
