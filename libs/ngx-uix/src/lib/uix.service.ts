/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable */
import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, OnDestroy, Output } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MaterialService } from '@fullerstack/ngx-material';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { BehaviorSubject, Subject, distinctUntilChanged } from 'rxjs';
import * as fullscreen from 'screenfull';
import { DeepReadonly } from 'ts-essentials';

import { DefaultUixConfig, UIX_MDI_ICONS } from './uix.default';
import { SvgIcons } from './uix.icon';

@Injectable({ providedIn: 'root' })
export class UixService implements OnDestroy {
  private nameSpace = 'UIX';
  window: Window;

  @Output() fullscreen$ = new EventEmitter<boolean>();
  private reSize$ = new BehaviorSubject<{ x: number; y: number }>({ x: 0, y: 0 });
  reSizeSub$ = this.reSize$
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => prev.x === curr.x && prev.y === curr.y));
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private iconsLoaded = false;
  private observer: ResizeObserver;

  constructor(
    @Inject(DOCUMENT) readonly document: Document,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly mat: MaterialService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ uix: DefaultUixConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.window = this.document.defaultView;

    this.initFullscreen();
    this.InitResizeListener();

    this.loadSvgIcons();
    this.logger.info(`[${this.nameSpace}] UixService ready ...`);
  }

  private loadSvgIcons() {
    if (!this.iconsLoaded) {
      for (const group in SvgIcons) {
        this.mat.registerSvgIconsInNamespace(SvgIcons[group], this.options.uix.cacheBustingHash);
      }
      this.iconsLoaded = true;
    }
    this.mat.registerSvgIconSet(UIX_MDI_ICONS, this.options.uix.cacheBustingHash);
  }

  private InitResizeListener() {
    this.observer = new ResizeObserver((entries) => {
      this.reSize$.next({ x: entries[0].contentRect.width, y: entries[0].contentRect.height });
    });

    this.observer.observe(this.document.body);
  }

  private initFullscreen() {
    if (fullscreen.isEnabled) {
      fullscreen.on('change', () => {
        this.fullscreen$.emit(this.fsObj.isFullscreen);
        this.logger.debug(`Fullscreen: (${this.fsObj.isFullscreen})`);
      });
    }
  }

  get fsObj(): fullscreen.Screenfull {
    return fullscreen as fullscreen.Screenfull;
  }

  get isFullscreenCapable() {
    return this.fsObj.isEnabled;
  }

  fullscreenOn(): void {
    if (this.fsObj.isEnabled) {
      this.fsObj.request();
    }
  }

  fullscreenOff(): void {
    if (this.fsObj.isEnabled) {
      this.fsObj.exit();
    }
  }

  toggleFullscreen(): void {
    if (fullscreen.isEnabled) {
      this.fsObj.toggle();
    }
  }

  isFullscreen(): boolean {
    return this.fsObj.isFullscreen;
  }

  addClass(el: HTMLElement, className: string): void {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  addClassToBody(className: string): void {
    this.document.body.classList.add(className);
  }

  removeClass(el: HTMLElement, className: string): void {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className += ' ' + className;
    }
  }

  removeClassFromBody(className: string): void {
    this.document.body.classList.remove(className);
  }

  refreshPage() {
    this.document.defaultView.location.reload();
  }

  get inIframe(): boolean {
    return this.window?.parent !== this.window;
  }

  preventOnTouchMove() {
    this.document.body.style.touchAction = 'none';
    // ontouchmove="event.preventDefault()"
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.observer.unobserve(this.document.body);
  }
}
