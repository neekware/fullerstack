import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatChip, MatChipList, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { I18nModule } from '@fullerstack/ngx-i18n';

import { AlertComponent } from './alert/alert.component';
import { HintComponent } from './hint/hint.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    I18nModule,
  ],
  declarations: [SnackbarComponent, AlertComponent, HintComponent],
  exports: [SnackbarComponent, AlertComponent, HintComponent],
  providers: [MatIcon, MatChip, MatChipList, MatSnackBar],
})
export class MsgModule {}
