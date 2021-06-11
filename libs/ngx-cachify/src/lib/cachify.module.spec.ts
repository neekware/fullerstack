import { TestBed, async } from '@angular/core/testing';

import { CachifyModule } from './cachify.module';

describe('CachifyModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CachifyModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(CachifyModule).toBeDefined();
  });
});
