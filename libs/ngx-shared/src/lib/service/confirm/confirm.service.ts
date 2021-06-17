import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { _ } from '@fullerstack/ngx-i18n';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '../../component/confirm/confirm.component';

@Injectable()
export class ConfirmationDialogService {
  constructor(readonly dialog: MatDialog) {}

  confirmation(title?: string, info?: string, question?: string): Observable<boolean> {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.title = title || _('COMMON.CONFIRMATION');
    dialogRef.componentInstance.question = question || _('COMMON.ARE_YOU_SURE');
    dialogRef.componentInstance.info = info;
    return dialogRef.afterClosed();
  }
}
