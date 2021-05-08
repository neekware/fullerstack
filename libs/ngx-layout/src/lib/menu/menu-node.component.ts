import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuNode } from '@fullerstack/ngx-menu';

@Component({
  selector: 'fullerstack-menu-node',
  templateUrl: './menu-node.component.html',
  styleUrls: ['./menu-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuNodeComponent {
  @Input() node: MenuNode;
  constructor(public router: Router) {}
}
