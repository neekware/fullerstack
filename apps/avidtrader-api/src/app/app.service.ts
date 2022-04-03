/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { HealthCheck } from '@fullerstack/agx-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): HealthCheck {
    return { ping: true };
  }
}
