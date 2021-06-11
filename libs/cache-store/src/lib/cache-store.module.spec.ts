import { TestBed, async } from '@angular/core/testing';

import { CacheStoreModule } from './cache-store.module';

describe('CacheStoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CacheStoreModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(CacheStoreModule).toBeDefined();
  });
});
