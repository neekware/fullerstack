/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/**
 * JWT config declaration
 */
export class JwtConfig {
  // http request round-trip in seconds
  networkDelay?: number;
  // refresh expired token up to leeway amount in seconds
  expiryLeeway?: number;
}
