import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@fullerstack/ngx-auth';
import { UixService } from '@fullerstack/ngx-uix';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  constructor(
    readonly router: Router,
    public auth: AuthService,
    public uix: UixService,
    readonly layout: LayoutService
  ) {}
}
