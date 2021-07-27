/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { User } from '@fullerstack/ngx-gql/schema';

/**
 * User config declaration
 */
export interface UserConfig {
  logState?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export interface UserState extends Omit<User, '__typename' | 'isActive'> {
  isActive?: boolean;
}
