import { TestBed, async } from '@angular/core/testing';

import { NgxAnnotatorModule } from './ngx-annotator.module';

describe('NgxAnnotatorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxAnnotatorModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(NgxAnnotatorModule).toBeDefined();
  });
});
