/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Controller } from '@nestjs/common';

import { SystemService } from './system.service';

@Controller('nsx-system')
export class SystemController {
  constructor(private systemService: SystemService) {}
}
