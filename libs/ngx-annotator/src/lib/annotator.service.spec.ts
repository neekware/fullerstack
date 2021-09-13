import { TestBed } from '@angular/core/testing';

import { AnnotatorService } from './annotator.service';

describe('AnnotatorService', () => {
  let service: AnnotatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
