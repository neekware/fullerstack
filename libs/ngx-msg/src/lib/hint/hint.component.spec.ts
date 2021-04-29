import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigModule } from '@fullerstack/ngx-config';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { TranslateService } from '@ngx-translate/core';
import { MsgModule } from '../msg.module';

import { HintComponent } from './hint.component';

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('HintComponent', () => {
  let component: HintComponent;
  let fixture: ComponentFixture<HintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigModule.forRoot({
          production: false,
        }),
        I18nModule,
        MsgModule,
      ],

      providers: [TranslateService],
      declarations: [HintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
