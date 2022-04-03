/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
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
