/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable */
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MaterialService } from '@fullerstack/ngx-material';
import { cloneDeep as ldDeepClone, merge as ldMergeWith } from 'lodash-es';
import { Subject } from 'rxjs';
import * as fullscreen from 'screenfull';
import { DeepReadonly } from 'ts-essentials';

import { DefaultUixConfig, UIX_MDI_ICONS } from './uix.default';
import { SvgIcons } from './uix.icon';

@Injectable({ providedIn: 'root' })
export class UixService implements OnDestroy {
  private nameSpace = 'UIX';
  @Output() fullscreen$ = new EventEmitter<boolean>();
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private iconsLoaded = false;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly mat: MaterialService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ uix: DefaultUixConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.initFullscreen();
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
