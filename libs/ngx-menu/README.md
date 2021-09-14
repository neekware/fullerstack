# @fullerstack/ngx-menu <img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

**A simple menu library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Creating a menu system can be a complicated task, and to avoid hard-coding repeated logic, this library creates complex nested menu system, derived from data tables.

**@fullerstack/ngx-menu** attempts to streamline the menu system of your application, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-menu |OR| yarn add @fullerstack/ngx-menu

# How to use

```typescript
// app.module.ts
import { MenuModule, MenuService } from '@fullerstack/ngx-menu';

NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MenuModule],
  provides: [MenuService],
  bootstrap: [AppComponent],
});
export class AppModule {}
```

```typescript
// app.component.ts

import { Component } from '@angular/core';
import { MenuService, MenuItem } from '@fullerstack/ngx-menu';

export const AppMenuTree: MenuItem[] = [
  {
    name: 'Admin',
    icon: 'wrench',
    permissions: [
      // superuser - full authorization
      'admin_superuser',
      // staff - limited auth - (ex: can't delete user)
      'admin_staff',
      // finance - limited auth - (ex: subscriptions, payable, etc.)
      'admin_finance',
      // HR = limited auth - (ex: access to performance reviews, benefits, etc.)
      'admin_hr',
    ],
    children: [
      {
        name: 'Accounts',
        icon: 'account',
        link: '/admin/accounts/profile',
      },
      {
        name: 'Settings',
        icon: 'account-cog',
        link: '/admin/accounts/settings',
        fullspan: true,
        permissions: ['admin_root', 'admin_staff', 'admin_hr'],
      },
      {
        name: 'Subscriptions',
        icon: ' account-multiple-check',
        link: '/admin/accounts/Subscriptions',
        fullspan: true,
        permissions: ['admin_root', 'admin_staff', 'admin_finance'],
      },
    ],
  },
  {
    name: 'Stocks',
    icon: 'trending-up',
    children: [
      {
        name: 'Sandbox Portfolio', // all users can simulate buy/sell stocks
        icon: 'account-check',
        link: '/finance/stocks/own',
      },
      {
        name: 'Wishlist',
        icon: 'playlist-check',
        link: '/finance/stocks/wishlist',
        disabled: true, // feature disabled (feature not ready)
      },
      {
        name: 'Portfolio', // paid users have real portfolio
        icon: 'account-check',
        link: '/finance/stocks/own',
        permissions: ['subscriptions_level_1'],
      },
      {
        name: 'Trade', // paid users can trade
        icon: ' home-currency-usd',
        link: '/finance/stocks/trade',
        permissions: ['subscriptions_level_1'],
      },
    ],
  },
  {
    name: 'Yahoo Finance',
    icon: 'google-analytics',
    link: 'https://yahoo.com',
    external: true,
  },
  {
    name: 'Youtube',
    icon: 'youtube',
    link: 'https://youtube.com',
    external: true,
    target: '_blank',
  },
];

@Component({
  selector: 'fullerstack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Fullerstack';
  menuTree = null;
  user: {
    // user is fetched from the server upon authentication
    firstName: 'Mike';
    lastName: 'Tyson';
    permissions: ['subscriptions_level_1'];
  };

  constructor(public menu: MenuService) {
    this.log.info('AppComponent loaded ...');
    this.buildMenu();
  }

  /**
   * Given a MenuItem, it returns true if item is allowed to display
   * @param node - MenuItem
   */
  private hasPermission(node: MenuItem) {
    const menuPerms = node.permissions || [];
    if (menuPerms.length === 0) {
      return true;
    }

    if (!this.user) {
      return false;
    }

    const userPerms = this.user.permissions || [];
    if (menuPerms.length === 0) {
      return false;
    }

    const hasPerm = menuPerms.some((value) => userPerms.indexOf(value) >= 0);
    return hasPerm;
  }

  buildMenu() {
    this.menu.PermissionVerificationFuncType(this.hasPermission.bind(this));
    this.menuTree = this.menu.buildMenuTree(AppMenuTree);
    // menu is ready for rendering
  }
}
```

# Advanced usage:

The following is the list of available options for each menu item.

```typescript
export interface MenuItem {
  // translatable name of this menu
  name: string;
  // icon for the menu
  icon?: string;
  // if link (clickable)
  link?: string;
  // hides menu, navigation, popups (ex: calendar page is fullspan)
  fullspan?: boolean;
  // if true, this will be a fullscreen page
  fullscreen?: boolean;
  // if true, this will be a fullscreen page without header and footer
  headless?: boolean;
  // if external link
  external?: boolean;
  // open in new tab (_blank)
  target?: string;
  // if menu is disabled
  disabled?: boolean;
  // if menu is allowed (permission) - for manual override
  allowed?: boolean;
  // permissions required to render this menu
  permissions?: string[];
  // submenu
  children?: MenuItem[];
}
```

Here are the helper functions on each MenuNode.

```typescript
// when looping through menu nodes
for (const node in menuTree.children) {
  // node.isLink - is a link or a node with children?
  // node..isNode - is a node with children?
  // node..hasChildren - has children?
  // node..isInternalLink - is a link & internal (ex: /dashboard/)
  // node..isExternalLink - is a link * external (ex: www.youtube.com)
  // node..isFullSpan - is a link that requires menu(s) to slide away
  // node..isFullScreen - is a link that requires the page be in fullscreen mode
  // node..isHeadless - is a link that requires header/footer to hide away
  // node..offset(value: number, unit = 'px') - offset for multi-level menu (for margin or padding)
  // node..isActive(url: string) - is this node active for the active route
}
```

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-menu.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-menu
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-menu.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-menu

```

```
