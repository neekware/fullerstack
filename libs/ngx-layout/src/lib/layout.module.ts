/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@fullerstack/ngx-auth';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';
import { MenuService } from '@fullerstack/ngx-menu';
import { SharedModule } from '@fullerstack/ngx-shared';
import { UixModule } from '@fullerstack/ngx-uix';

import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';
import { MenuLinkComponent } from './menu/menu-link.component';
import { MenuNodeComponent } from './menu/menu-node.component';
import { MenuComponent } from './menu/menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { OptionsComponent } from './options/options.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    UixModule,
    SharedModule,
    AuthModule,
  ],
  declarations: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    OptionsComponent,
    FooterComponent,
    LayoutComponent,
  ],
  exports: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    OptionsComponent,
    FooterComponent,
    LayoutComponent,
  ],
  providers: [LayoutService, MenuService],
})
export class LayoutModule {}
