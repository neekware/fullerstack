import { Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';
import { Subject } from 'rxjs';

import {
  ConfigService,
  ApplicationConfig,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';

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
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private iconsLoaded = false;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly sanitizer: DomSanitizer,
    readonly mdIconRegistry: MatIconRegistry
  ) {
    this.options = ldNestedMerge(
      { i18n: DefaultUixConfig },
      this.config.options
    );

    this.loadSvgIcons();
    logger.debug('UixService ready ...');
  }

  private loadSvgIcons() {
    if (!this.iconsLoaded) {
      SvgIcons.forEach((icon) => {
        const iconSecurePath = this.sanitizer.bypassSecurityTrustResourceUrl(
          icon.path
        );
        icon.names.forEach((name) => {
          this.mdIconRegistry.addSvgIconInNamespace(
            icon.namespace,
            name,
            iconSecurePath
          );
        });
      });
      this.iconsLoaded = true;
    }
    const mdiSecurePath = this.sanitizer.bypassSecurityTrustResourceUrl(
      UIX_MDI_ICONS
    );
    this.mdIconRegistry.addSvgIconSet(mdiSecurePath);
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
