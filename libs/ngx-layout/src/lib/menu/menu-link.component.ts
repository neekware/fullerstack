import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DeepReadonly } from 'ts-essentials';
import { MenuNode } from '@fullerstack/ngx-menu';

import { DefaultLayoutState } from '../store/layout-state.default';
import { LayoutState } from '../store/layout-state.model';

@Component({
  selector: 'fullerstack-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent {
  @Input() state: DeepReadonly<LayoutState> = DefaultLayoutState;
  @Input() toggleMenu: () => void;
  @Input() link: MenuNode;

  constructor(readonly router: Router) {}

  redirectUrl(node: MenuNode) {
    if (node.isFullSpan && this.state.menuOpen) {
      this.toggleMenu();
    }
    this.router.navigate([node.link]);
  }
}
