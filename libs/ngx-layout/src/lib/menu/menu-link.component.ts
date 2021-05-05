import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';

import { MenuNode } from '@fullerstack/ngx-menu';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent {
  @Input() link: MenuNode;

  constructor(
    readonly router: Router,
    readonly auth: AuthService,
    readonly layout: LayoutService
  ) {}

  redirectUrl(node: MenuNode) {
    if (
      (node.isFullSpan || this.layout.state.isHandset) &&
      this.layout.state.menuOpen
    ) {
      this.layout.toggleMenu();
    }
    this.auth.goTo(node.link);
  }
}
