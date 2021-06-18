/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { registerAs } from '@nestjs/config';

import { environment } from '../environments/environment';

export const appConfiguration = registerAs('appConfig', () => ({
  ...environment,
  // add anything you want here, to make it available to all nestjs libs
  // via ConfigService
  // env: process.env.APP_ENV,
  // name: process.env.APP_NAME,
  // url: process.env.APP_URL,
  // port: process.env.APP_PORT,
}));
