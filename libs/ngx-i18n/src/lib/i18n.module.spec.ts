import { waitForAsync, TestBed } from '@angular/core/testing';
import { I18nModule } from './i18n.module';

describe('I18nModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [I18nModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(I18nModule).toBeDefined();
  });
});
