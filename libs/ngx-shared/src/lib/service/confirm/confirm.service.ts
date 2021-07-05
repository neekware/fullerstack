/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '../../component/confirm/confirm.component';

@Injectable()
export class ConfirmationDialogService {
  constructor(readonly dialog: MatDialog) {}

  confirmation(title?: string, info?: string, question?: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title || _('COMMON.CONFIRMATION');
    dialogRef.componentInstance.question = question || _('COMMON.ARE_YOU_SURE');
    dialogRef.componentInstance.info = info;
    return dialogRef.afterClosed();
  }
}
