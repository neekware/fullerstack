/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigModule } from '@fullerstack/ngx-config';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MsgModule } from '@fullerstack/ngx-msg';

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
