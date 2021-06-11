import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigModule } from '@fullerstack/ngx-config';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MsgModule } from '@fullerstack/ngx-msg';
import { TranslateService } from '@ngx-translate/core';

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
      providers: [MatSnackBar, MatChipList, MatChip, TranslateService],
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
