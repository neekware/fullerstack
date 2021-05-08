import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { AlertComponent } from './alert/alert.component';
import { HintComponent } from './hint/hint.component';
import { MsgService } from './msg.service';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  imports: [CommonModule, MaterialModule, I18nModule],
  declarations: [SnackbarComponent, AlertComponent, HintComponent],
  exports: [SnackbarComponent, AlertComponent, HintComponent],
})
export class MsgModule {
  imports: [CommonModule];
  provides: [MsgService];
}
