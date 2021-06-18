/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialService } from '@fullerstack/ngx-material';

import { UixService } from './uix.service';

@NgModule({
  imports: [CommonModule],
  providers: [UixService, MaterialService],
})
export class UixModule {}
