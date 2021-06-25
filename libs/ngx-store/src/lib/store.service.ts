/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { DefaultStoreConfig } from './store.default';
import { SetStateReducer, StoreType } from './store.model';
import { Store } from './store.util';

@Injectable()
export class StoreService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private store: Store;

  constructor(private config: ConfigService, private logger: LoggerService) {
    this.options = ldNestedMerge({ cachify: DefaultStoreConfig }, this.config.options);
    this.store = new Store({}, this.options.cachify.immutable);
    this.logger.debug('StoreService ready ...');
  }

  getState(): StoreType {
    return this.store.getState();
  }

  setState(updater: SetStateReducer<StoreType> | Partial<StoreType>): void;
  setState(updater: any): void {
    this.setState(updater);
  }

  state$(): Observable<StoreType> {
    return this.store.state$();
  }

  select$<K>(key: string): Observable<K> {
    return this.store.select$(key);
  }
}
