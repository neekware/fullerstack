import { waitForAsync, TestBed } from '@angular/core/testing';
import { UixModule } from './uix.module';

describe('UixModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UixModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(UixModule).toBeDefined();
  });
});
