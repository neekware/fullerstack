/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Controller } from '@nestjs/common';

import { SystemService } from './system.service';

@Controller('nsx-system')
export class SystemController {
  constructor(private systemService: SystemService) {}
}
