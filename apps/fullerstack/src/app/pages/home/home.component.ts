import { Component } from '@angular/core';

import { LayoutService } from '@fullerstack/ngx-layout';
import { AuthService } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public auth: AuthService, public layout: LayoutService) {}

  get pitchList() {
    return [
      {
        title: _('PITCH.MONITOR.TITLE'),
        description: _('PITCH.MONITOR.DESCRIPTION'),
        image: '/assets/images/misc/analytics.png',
      },
      {
        title: _('PITCH.CURRENCY.TITLE'),
        description: _('PITCH.CURRENCY.DESCRIPTION'),
        image: '/assets/images/misc/currencies.png',
      },
      {
        title: _('PITCH.HISTORICAL.TITLE'),
        description: _('PITCH.HISTORICAL.DESCRIPTION'),
        image: '/assets/images/misc/trends.png',
      },
      {
        title: _('PITCH.PLATFORMS.TITLE'),
        description: _('PITCH.PLATFORMS.DESCRIPTION'),
        image: '/assets/images/misc/platforms.png',
      },
    ];
  }
}
