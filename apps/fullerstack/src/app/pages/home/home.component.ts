import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LayoutService } from '@fullerstack/ngx-layout';
import { AuthService } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    public layout: LayoutService
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.data['title']);
  }

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
