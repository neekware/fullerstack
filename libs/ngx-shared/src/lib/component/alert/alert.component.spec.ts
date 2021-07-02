/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigModule } from '@fullerstack/ngx-config';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MsgModule } from '@fullerstack/ngx-msg';

import { AlertComponent } from './alert.component';

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

xdescribe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigModule.forRoot({
          production: false,
        }),
        I18nModule,
        MsgModule,
      ],
      providers: [MatSnackBar, MatChipList, MatChip],
      declarations: [AlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
