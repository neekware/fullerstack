/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthInterceptor, AuthModule } from '@fullerstack/ngx-auth';
import { CachifyInterceptor } from '@fullerstack/ngx-cachify';
import { ConfigModule } from '@fullerstack/ngx-config';
import { GqlInterceptor } from '@fullerstack/ngx-gql';
import { GqlModule } from '@fullerstack/ngx-gql';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { JwtModule } from '@fullerstack/ngx-jwt';
import { LayoutModule } from '@fullerstack/ngx-layout';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { MaterialModule } from '@fullerstack/ngx-material';
import { MsgModule } from '@fullerstack/ngx-msg';
import { SharedModule } from '@fullerstack/ngx-shared';
import { StoreModule } from '@fullerstack/ngx-store';
import { UixModule } from '@fullerstack/ngx-uix';
import { UserModule } from '@fullerstack/ngx-user';
import { ValidationService } from '@fullerstack/ngx-util';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AboutComponent } from './pages/about/about.component';
import { ForexComponent } from './pages/forex/forex.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileUpdateComponent } from './pages/user/profile-update.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    AppComponent,
    ProfileUpdateComponent,
    ForexComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(AppRoutes),
    ConfigModule.forRoot(environment),
    LoggerModule,
    StoreModule,
    JwtModule,
    MsgModule,
    SharedModule,
    GqlModule,
    I18nModule.forRoot(),
    AuthModule,
    UserModule,
    UixModule,
    LayoutModule,
  ],
  providers: [
    ValidationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachifyInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GqlInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
