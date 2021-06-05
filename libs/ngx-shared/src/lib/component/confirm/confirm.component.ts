import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-confimation-dialog',
  templateUrl: './confirm.component.html',
})
export class ConfirmationDialogComponent {
  title: string;
  question: string;
  info: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public i18n: I18nService
  ) {}
}
