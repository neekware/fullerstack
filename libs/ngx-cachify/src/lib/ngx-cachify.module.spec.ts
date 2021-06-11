import { TestBed, async } from '@angular/core/testing';

import { NgxCachifyModule } from './ngx-cachify.module';

describe('NgxCachifyModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxCachifyModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(NgxCachifyModule).toBeDefined();
  });
});
