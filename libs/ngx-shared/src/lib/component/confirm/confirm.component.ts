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
