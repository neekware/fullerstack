import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

import { ConfigModule } from '@fullerstack/ngx-config';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { MsgService } from './msg.service';

import { MsgModule } from './msg.module';

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('MsgService', () => {
  let service: MsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          production: false,
        }),
        I18nModule,
        MsgModule,
      ],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {},
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {},
        },
        MsgService,
      ],
    });

    service = TestBed.inject(MsgService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
