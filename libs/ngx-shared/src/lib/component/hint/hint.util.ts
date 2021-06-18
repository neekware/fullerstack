/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { tryGet } from '@fullerstack/agx-util';

import { ValidatorHintMessages } from './hint.model';

export const validatorHintMessage = (key: string): string => {
  return tryGet(() => ValidatorHintMessages[key]);
};
