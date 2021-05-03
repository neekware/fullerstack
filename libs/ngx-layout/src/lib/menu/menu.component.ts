import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';
import {
  DefaultMenuTree,
  MenuItem,
  MenuNode,
  MenuService,
} from '@fullerstack/ngx-menu';

import { LayoutService } from '../layout.service';
import { LayoutMenuTree } from './menu.default';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  rootNode: MenuNode = null;

  constructor(
    readonly router: Router,
    readonly layout: LayoutService,
    readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.layout.menu.setPermissionVerificationFunction(
      this.hasPermission.bind(this)
    );

    this.rootNode = this.layout.menu.buildMenuTree(DefaultMenuTree);

    this.auth.authChanged$.subscribe((state) => {
      const forceMenuRebuild = true;
      this.rootNode = this.layout.menu.buildMenuTree(
        DefaultMenuTree,
        forceMenuRebuild
      );
    });
  }

  redirectUrl(node: MenuNode) {
    if (node.isLink) {
      if (node.isFullSpan && this.layout.state.menuOpen) {
        this.layout.toggleMenu();
      }
      // this.auth.goTo(node.link);
    }
  }

  hasPermission(node: MenuItem) {
    const menuPerms = node.permissions || [];
    if (menuPerms.length === 0) {
      return true;
    }

    const userPerms = []; // tryGet<string>(() => this.auth.state.userProfile.permissions, []);
    if (menuPerms.length === 0) {
      return false;
    }

    const hasPerm = menuPerms.some((value) => userPerms.indexOf(value) >= 0);
    return hasPerm;
  }
}
