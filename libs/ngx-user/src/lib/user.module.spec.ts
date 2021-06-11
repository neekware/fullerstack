import { TestBed, async } from '@angular/core/testing';

import { UserModule } from './user.module';

describe('UserModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserModule],
    }).compileComponents();
  }));

  it('should have a module definition', () => {
    expect(UserModule).toBeDefined();
  });
});
