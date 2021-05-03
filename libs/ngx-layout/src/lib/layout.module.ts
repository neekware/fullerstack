import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { NgxsModule } from '@ngxs/store';
import { MaterialModule } from '@fullerstack/ngx-material';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { UixModule } from '@fullerstack/ngx-uix';
import { MenuService } from '@fullerstack/ngx-menu';
import { AuthModule } from '@fullerstack/ngx-auth';

import { MenuComponent } from './menu/menu.component';
import { MenuLinkComponent } from './menu/menu-link.component';
import { MenuNodeComponent } from './menu/menu-node.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { LayoutComponent } from './layout.component';
import { OptionsComponent } from './options/options.component';
import { LayoutService } from './layout.service';
import { LayoutStoreState } from './store/layout-state.store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    I18nModule,
    UixModule,
    NgxsModule.forFeature([LayoutStoreState]),
    AuthModule,
  ],
  declarations: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    OptionsComponent,
    LayoutComponent,
  ],
  exports: [
    MenuComponent,
    MenuLinkComponent,
    MenuNodeComponent,
    NavbarComponent,
    NotificationComponent,
    OptionsComponent,
    LayoutComponent,
  ],
  providers: [MatIcon, LayoutService, MenuService],
})
export class LayoutModule {}
