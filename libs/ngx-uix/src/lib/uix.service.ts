/* eslint-disable */
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';
import { Subject } from 'rxjs';

import {
  ConfigService,
  ApplicationConfig,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MaterialService } from '@fullerstack/ngx-material';

import { DefaultUixConfig, UIX_MDI_ICONS } from './uix.default';
import { SvgIcons } from './uix.icon';

// import * as fullscreen from 'screenfull';
export const screenfull = {
  on: () => {},
  off: () => {},
  enabled: () => {},
  toggle: () => {},
};

@Injectable()
export class UixService implements OnDestroy {
  @Output() fullscreen$ = new EventEmitter<boolean>();
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private iconsLoaded = false;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly mat: MaterialService
  ) {
    this.options = ldNestedMerge(
      { uix: DefaultUixConfig },
      this.config.options
    );

    this.initFullscreen();
    this.loadSvgIcons();
    this.logger.info('UixService ready ...');
  }

  private loadSvgIcons() {
    if (!this.iconsLoaded) {
      for (const group in SvgIcons) {
        this.mat.registerSvgIconsInNamespace(
          SvgIcons[group],
          this.options.uix.cacheBustingHash
        );
      }
      this.iconsLoaded = true;
    }
    this.mat.registerSvgIconSet(
      UIX_MDI_ICONS,
      this.options.uix.cacheBustingHash
    );
  }

  initFullscreen() {
    // if (screenfull.enabled()) {
    //   screenfull.on('change', () => {
    //     this.fullscreen$.emit(screenfull.isFullscreen);
    //     this.logger.debug(`Fullscreen: (${screenfull.isFullscreen})`);
    //   });
    // }
  }

  get isFullscreenCapable() {
    return screenfull.enabled;
  }

  fullscreenOn(): void {
    if (this.isFullscreenCapable) {
      screenfull.on();
    }
  }

  fullscreenOff(): void {
    if (this.isFullscreenCapable) {
      screenfull.off();
    }
  }

  toggleFullscreen(): void {
    if (this.isFullscreenCapable) {
      screenfull.toggle();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
