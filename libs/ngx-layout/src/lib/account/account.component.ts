import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  constructor(
    readonly auth: AuthService,
    readonly i18n: I18nService,
    readonly layout: LayoutService
  ) {}
}
