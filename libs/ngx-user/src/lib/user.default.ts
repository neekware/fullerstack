/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { UserConfig, UserState } from './user.model';

export const DefaultUserConfig: UserConfig = {
  logState: true,
};

export const DefaultUserState: UserState = {
  id: null,
  email: null,
  isVerified: false,
  username: null,
  firstName: null,
  lastName: null,
  language: null,
  role: null,
  permissions: [],
  groupId: null,
};
