import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { DeepReadonly } from 'ts-essentials';
import { get, merge as ldNestedMerge } from 'lodash-es';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import {
  ConfigService,
  ApplicationConfig,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';

import { GTagEventParams, GTagPageViewParams } from './gtag.model';
import { DefaultGTagConfig } from './gtag.default';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let gtag: (...args: any) => void;

// @dynamic - Tells aot that type `Document` will be eventually resolved
@Injectable({
  providedIn: 'root',
})
export class GTagService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly config: ConfigService,
    readonly logger: LoggerService
  ) {
    this.options = ldNestedMerge(
      { gtag: DefaultGTagConfig },
      this.config.options
    );
    if (this.options.gtag.isEnabled) {
      if (!this.options.gtag.trackingId) {
        throw new Error('Error - GTag enabled without a valid tracking ID');
      }

      this.loadScript();
      this.initScript();

      this.logger.info(
        `GTagService ready ... (${this.options.gtag.trackingId})`
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
        map(() => this.route),
        map((route) => route.firstChild),
        switchMap((route) => route.data),
        map((data) => get(data, 'title', this.options.appName)),
        tap((title) => {
          this.trackPageView({ page_title: title });
        })
      )
      .subscribe();
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
        this.logger.warn(
          'Error - Skipping page track. Gtag may not be ready yet ...'
        );
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
        this.logger.warn(
          'Error - Skipping event track. Gtag may not be ready yet ...'
        );
      }
    }
  }
}