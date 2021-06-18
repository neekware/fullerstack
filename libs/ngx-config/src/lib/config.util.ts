/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { RemoteType } from './config.model';
import { ConfigService } from './config.service';

/**
 * Remote Config Fetch Factory
 * @param config ConfigService Injectable
 */
export function remoteConfigFactory(config: ConfigService): () => RemoteType {
  return () => config.fetchRemoteConfig();
}
