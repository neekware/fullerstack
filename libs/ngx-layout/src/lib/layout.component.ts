import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoggerService } from '@fullerstack/ngx-logger';
import { I18nService } from '@fullerstack/ngx-i18n';

import { LayoutService } from './layout.service';

@Component({
  selector: 'fullerstack-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sideMenu') private sideMenu: MatSidenav;
  @ViewChild('notifyMenu') private notifyMenu: MatSidenav;
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly layout: LayoutService
  ) {}

  ngOnInit() {
    this.layout.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.menuOpen) {
        this.sideMenu?.open();
      } else {
        this.sideMenu?.close();
      }
      if (state.notifyOpen) {
        this.notifyMenu?.open();
      } else {
        this.notifyMenu?.close();
      }
    });
  }

  ngAfterViewInit(): void {
    this.sideMenu.closedStart.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.layout.state?.menuOpen) {
        this.layout.toggleMenu();
      }
    });
    this.notifyMenu.closedStart.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.layout.state?.notifyOpen) {
        this.layout.toggleNotification();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('LayoutComponent destroyed ...');
  }
}
