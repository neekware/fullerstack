/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultGTagConfig } from './gtag.default';
import { GTagEventParams, GTagPageViewParams } from './gtag.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let gtag: (...args: any) => void;

// @dynamic - Tells aot that type `Document` will be eventually resolved
@Injectable({ providedIn: 'root' })
export class GTagService implements OnDestroy {
  private nameSpace = 'GTAG';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) readonly document: Document,
    readonly router: Router,
    readonly title: Title,
    readonly route: ActivatedRoute,
    readonly config: ConfigService,
    readonly logger: LoggerService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ gtag: DefaultGTagConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    if (this.options.gtag.isEnabled) {
      if (!this.options.gtag.trackingId) {
        throw new Error('Error - GTag enabled without a valid tracking ID');
      }

      this.loadScript();
      this.initScript();

      this.logger.info(
        `[${this.nameSpace}] GTagService ready ... (${this.options.gtag.trackingId})`
      );

      if (this.options.gtag?.routeChangeTracking) {
        this.enablePageView();
      }
    }
  }

  private initScript() {
    const id = this.options.gtag.trackingId;
    const enabled = this.options.gtag.routeChangeTracking;
    const tag = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', '${id}', { 'send_page_view': ${enabled} });
    `;
    const elNode = Object.assign(this.document.createElement('script'), {
      text: tag,
    });
    this.document.body.appendChild(elNode);
  }

  private loadScript() {
    const url = `${this.options.gtag.gtagUrl}?id=${this.options.gtag.trackingId}`;
    if (!this.document.querySelectorAll(`[src="${url}"]`).length) {
      const elNode = Object.assign(this.document.createElement('script'), {
        type: 'text/javascript',
        src: url,
        async: true,
      });
      this.document.body.appendChild(elNode);
    }
  }

  private enablePageView() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.title.getTitle() || this.options.appName),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (title) => {
          this.trackPageView({ page_title: title });
        },
      });
  }

  trackPageView(params?: GTagPageViewParams) {
    if (this.options.gtag.isEnabled) {
      params = {
        ...{
          page_path: this.router.url,
          page_location: this.document.defaultView.location.href,
          page_title: this.options.appName,
        },
        ...params,
      };
      if (typeof gtag === 'function') {
        try {
          gtag('config', this.options.gtag.trackingId, params);
        } catch (err) {
          this.logger.error('Error - Failed to track page view', err);
        }
      } else {
        this.logger.warn('Error - Skipping page track. Gtag may not be ready yet ...');
      }
    }
  }

  trackEvent(name: string, params: GTagEventParams) {
    if (this.options.gtag.isEnabled) {
      if (typeof gtag === 'function') {
        try {
          gtag('event', name, params || {});
        } catch (err) {
          this.logger.error('Error - Failed to track event', err);
        }
      } else {
        this.logger.warn('Error - Skipping event track. Gtag may not be ready yet ...');
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
