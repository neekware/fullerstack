/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

export interface JwtDto {
  userId: string;
  sessionVersion?: number;
}

export const JWT_BEARER_REALM = 'Bearer';
