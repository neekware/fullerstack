/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientModule } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { MaterialModule } from '@fullerstack/ngx-material';

import { AppComponent } from './app.component';

/** Application Environment with remote config endpoint */
const appEnv: Readonly<ApplicationConfig> = {
  version: '1.0.1',
  production: true,
  remoteConfig: {
    endpoint: 'http://foo.com/remote/config',
  },
};

xdescribe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, MaterialModule, ConfigModule.forRoot(appEnv)],
        declarations: [AppComponent],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
