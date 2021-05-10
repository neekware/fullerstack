import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@fullerstack/ngx-auth';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';
import { MenuService } from '@fullerstack/ngx-menu';
import { UixModule } from '@fullerstack/ngx-uix';
import { NgxsModule } from '@ngxs/store';

import { AccountComponent } from './account/account.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';
import { MenuLinkComponent } from './menu/menu-link.component';
import { MenuNodeComponent } from './menu/menu-node.component';
import { MenuComponent } from './menu/menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { OptionsComponent } from './options/options.component';
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
    AccountComponent,
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
    AccountComponent,
    NavbarComponent,
    NotificationComponent,
    OptionsComponent,
    FooterComponent,
    LayoutComponent,
  ],
  providers: [MatIcon, LayoutService, MenuService],
})
export class LayoutModule {}
