import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { I18nService } from '@fullerstack/ngx-i18n';
import { DefaultMenuTree, MenuNode, MenuService } from '@fullerstack/ngx-menu';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  rootNode: MenuNode;
  expandIcon = 'chevron-right';
  private currentUrl: string = null;

  constructor(
    readonly router: Router,
    readonly i18n: I18nService,
    readonly menu: MenuService,
    readonly layout: LayoutService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    this.rootNode = this.menu.buildMenuTree(DefaultMenuTree);
    this.expandIcon =
      this.i18n.direction === 'rtl' ? 'chevron-left' : 'chevron-right';
  }

  redirectUrl(node: MenuNode) {
    if (node.isLink) {
      if (node.isFullSpan && this.layout.state?.menuOpen) {
        this.layout.toggleMenu();
      }
      this.router.navigate([node.link]);
    }
  }

  isActive(node: MenuNode): boolean {
    if (node.link === this.currentUrl) {
      return true;
    }
    for (const child of node.children) {
      if (this.isActive(child)) {
        return true;
      }
    }
    return false;
  }
}
