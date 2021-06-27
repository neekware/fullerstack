/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { sample } from 'lodash-es';
import { Observable, Subject, timer } from 'rxjs';
import { filter, map, share, takeUntil } from 'rxjs/operators';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  activeTabIndex = 1;
  currentTime$: Observable<Date>;

  notifications = [
    {
      title: 'Account',
      message: 'Account needs post registration verification',
      icon: 'account',
      color: 'primary',
    },
    {
      title: 'Settings',
      message: 'Settings updated',
      icon: 'cogs',
      color: 'accent',
    },
    {
      title: 'Profile',
      message: 'Profile needs updated',
      icon: 'information-outline',
      color: 'warn',
    },
    {
      title: 'Order accepted',
      message: 'Order to buy 100 APPL @ $207',
      icon: 'currency-usd',
      color: 'primary',
    },
    {
      title: 'Order executed',
      message: 'Purchased 100 APPL shares',
      icon: 'check-outline',
      color: 'primary',
    },
  ];
  markets = [
    {
      ticker: 'NYSE',
      price: '12,134.00',
      change: '+1.63%',
      color: 'green',
    },
    {
      ticker: 'DOW JONES',
      price: '12,134.00',
      change: '-1.63%',
      color: 'red',
    },
    {
      ticker: 'NASDAQ',
      price: '12,134.00',
      change: '0.0%',
      color: 'gray',
    },
  ];
  stocks = [
    {
      ticker: 'TSLA',
      price: '359.44',
      change: '+1.63%',
      color: 'green',
    },
    {
      ticker: 'AMZN',
      price: '1,865.90',
      change: '0.0%',
      color: 'gray',
    },
    {
      ticker: 'AAPL',
      price: '207.31',
      change: '-1.63%',
      color: 'red',
    },
    {
      ticker: 'GOOGL',
      price: '1,265.37',
      change: '5.63%',
      color: 'green',
    },
  ];

  hasNewNotification = true;

  constructor(readonly layout: LayoutService) {
    if (this.hasNewNotification) {
      this.activeTabIndex = 1;
    }
  }

  ngOnInit() {
    this.currentTime$ = timer(0, 1000).pipe(
      filter(() => this.layout.state.notifyOpen),
      map(() => new Date()),
      share(),
      takeUntil(this.destroy$)
    );
  }

  handleTapChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.hasNewNotification = sample([true, false]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
