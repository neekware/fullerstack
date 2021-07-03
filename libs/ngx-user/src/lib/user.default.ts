/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

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
  role: null,
  permissions: [],
  groupId: null,
  isLoading: false,
  hasError: false,
  message: null,
};
