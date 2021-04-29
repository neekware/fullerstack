import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { MsgModule } from '@fullerstack/ngx-msg';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConfigModule.forRoot(environment),
    LoggerModule.forRoot(),
    MsgModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
