import { waitForAsync, TestBed } from '@angular/core/testing';
import { MaterialModule } from './material.module';

describe('NgxMaterialModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(MaterialModule).toBeDefined();
  });
});
