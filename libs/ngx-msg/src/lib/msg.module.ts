/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { MsgService } from './msg.service';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  imports: [CommonModule, MaterialModule, I18nModule],
  exports: [SnackbarComponent],
  declarations: [SnackbarComponent],
  providers: [MsgService],
})
export class MsgModule {}
