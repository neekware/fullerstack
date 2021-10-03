/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AnnotatorModule } from '@fullerstack/ngx-annotator';
import { AuthModule } from '@fullerstack/ngx-auth';
import { ConfigModule } from '@fullerstack/ngx-config';
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

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { httpInterceptorProvidersOrderedList } from './app.intercept';
import { AppRoutes } from './app.routing';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { EmailChangePerformComponent } from './pages/email-change-perform/email-change-perform.component';
import { EmailChangeRequestComponent } from './pages/email-change-request/email-change-request.component';
import { ForexComponent } from './pages/forex/forex.component';
import { HomeComponent } from './pages/home/home.component';
import { LanguageChangeComponent } from './pages/language-change/language-change.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';
import { PasswordResetPerformComponent } from './pages/password-reset-perform/password-reset-perform.component';
import { PasswordResetRequestComponent } from './pages/password-reset-request/password-reset-request.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TrendComponent } from './pages/trend/trend.component';
import { UserVerifyComponent } from './pages/user-verify/user-verify.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    NotfoundComponent,
    AppComponent,
    ProfileUpdateComponent,
    PasswordChangeComponent,
    PasswordResetRequestComponent,
    PasswordResetPerformComponent,
    EmailChangeRequestComponent,
    EmailChangePerformComponent,
    LanguageChangeComponent,
    ContactUsComponent,
    ForexComponent,
    PortfolioComponent,
    TrendComponent,
    UserVerifyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(AppRoutes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
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
    AnnotatorModule,
  ],
  providers: [...httpInterceptorProvidersOrderedList],

  bootstrap: [AppComponent],
})
export class AppModule {}
