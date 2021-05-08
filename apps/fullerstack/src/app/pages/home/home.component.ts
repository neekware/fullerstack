import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  handSet = false;
  logoSize = 'large';
  pitchList = [
    {
      title: _('PITCH.GROW.TITLE'),
      description: _('PITCH.GROW.DESCRIPTION'),
      image: '/assets/images/misc/ceo.png',
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

  constructor(public auth: AuthService, public layout: LayoutService) {}

  ngOnInit() {
    this.layout.handset$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.matches) {
        this.handSet = true;
        this.logoSize = 'small';
      } else {
        this.handSet = false;
        this.logoSize = 'large';
      }
    });
  }

  get logo(): string {
    return `/assets/images/logos/logo-${this.logoSize}.png`;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
