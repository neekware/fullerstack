import { waitForAsync, TestBed } from '@angular/core/testing';
import { GqlModule } from './gql.module';

describe('GqlModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [GqlModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(GqlModule).toBeDefined();
  });
});
