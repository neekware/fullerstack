/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-confirmation-dialog',
  templateUrl: './confirm.component.html',
})
export class ConfirmationDialogComponent {
  title: string;
  question: string;
  info: string;

  constructor(
    readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    readonly i18n: I18nService
  ) {}
}
