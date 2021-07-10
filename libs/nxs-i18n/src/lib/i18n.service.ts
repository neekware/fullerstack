/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { RenderContext, RenderOptions, renderTemplate } from '@fullerstack/nsx-common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge } from 'lodash';
import { DeepReadonly } from 'ts-essentials';

import { DefaultI18nConfig } from './i18n.default';
import { I18nConfig } from './i18n.model';

@Injectable()
export class I18nService {
  readonly options: DeepReadonly<I18nConfig> = DefaultI18nConfig;

  constructor(readonly config: ConfigService) {
    this.options = ldNestMerge(
      { ...this.options },
      this.config.get<I18nConfig>('appConfig.i18nConfig')
    );
  }

  render(template: string, params: RenderContext, options?: RenderOptions): string {
    return renderTemplate(template, params, options);
  }

  getDefaultLocale(): string {
    return this.options.defaultLocale;
  }

  getAvailableLocales(): Readonly<string[]> {
    return this.options.availableLocales;
  }

  getEnabledLocales(): Readonly<string[]> {
    return this.options.enabledLocales;
  }
}
