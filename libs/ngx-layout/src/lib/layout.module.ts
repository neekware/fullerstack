import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIcon } from '@angular/material/icon';

import { MaterialModule } from '@fullerstack/ngx-material';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { MenuComponent } from './menu/menu.component';
import { MenuLinkComponent } from './menu/menu-link.component';
import { MenuNodeComponent } from './menu/menu-node.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { LayoutComponent } from './layout.component';
import { UixModule } from '@fullerstack/ngx-uix';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, I18nModule, UixModule],
  declarations: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    LayoutComponent,
  ],
  exports: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    LayoutComponent,
  ],
  providers: [MatIcon],
})
export class LayoutModule {}
