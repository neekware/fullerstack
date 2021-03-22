import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CfgModule } from '@fullerstack/ngx-cfg';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, CfgModule.forRoot(environment)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
