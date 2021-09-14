/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { MenuNode } from '@fullerstack/ngx-menu';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
})
export class MenuLinkComponent {
  @Input() link: MenuNode;

  constructor(
    readonly router: Router,
    readonly auth: AuthService,
    readonly layout: LayoutService
  ) {}

  handleClicks(node: MenuNode) {
    if ((node.isFullSpan || this.layout.state.isHandset) && this.layout.state.menuOpen) {
      this.layout.toggleMenu();
    }

    if (node.isHeadless && !this.layout.state.isHeadless) {
      this.layout.setHeadless(true);
    } else {
      this.layout.setHeadless(false);
    }
  }
}
