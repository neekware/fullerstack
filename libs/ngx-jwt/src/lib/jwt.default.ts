/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { JwtConfig } from './jwt.model';

/**
 * Default configuration - JWT module
 */
export const DefaultJwtConfig: JwtConfig = {
  // default of 1 second. frontend specific
  networkDelay: 1,
  // some backend may still honor requests by `x` seconds after expiry
  expiryLeeway: 5,
};
