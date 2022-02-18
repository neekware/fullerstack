/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HealthCheck } from '@fullerstack/agx-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): HealthCheck {
    return { ping: true };
  }
}
