/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { StoreService } from '@fullerstack/ngx-store';
import { SystemService } from '@fullerstack/ngx-system';
import { cloneDeep as ldDeepClone, merge as ldMergeWith } from 'lodash-es';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAnnotatorConfig, DefaultAnnotatorState } from './annotator.default';
import { ANNOTATOR_URL, AnnotatorState } from './annotator.model';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService implements OnDestroy {
  private nameSpace = 'ANNOTATOR';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AnnotatorState> = DefaultAnnotatorState;
  stateSub$: Observable<AnnotatorState>;
  private destroy$ = new Subject<boolean>();
  private lastUrl: string;

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly layout: LayoutService,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ layout: DefaultAnnotatorConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          if (this.router.url?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(true);
          } else if (this.lastUrl?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(false);
          }
          this.lastUrl = this.router.url;
        },
      });

    this.claimSlice();
    this.initState();
    this.subState();
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    if (!this.options?.layout?.logState) {
      this.claimId = this.store.claimSlice(this.nameSpace);
    } else {
      this.claimId = this.store.claimSlice(this.nameSpace, this.logger.debug.bind(this.logger));
    }
  }

  /**
   * Initialize Layout state
   */
  private initState() {
    this.store.setState(this.claimId, {
      ...DefaultAnnotatorState,
      appName: this.options.appName,
    });
  }

  /**
   * Subscribe to Layout state changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<AnnotatorState>(this.nameSpace);

    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        this.state = { ...DefaultAnnotatorState, ...newState };
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
