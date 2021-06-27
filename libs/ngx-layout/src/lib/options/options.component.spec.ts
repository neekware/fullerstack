/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

import { LayoutService } from '../layout.service';
import { OptionsComponent } from './options.component';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

xdescribe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ConfigModule.forRoot(environment), LoggerModule],
        declarations: [OptionsComponent],
        providers: [LayoutService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
