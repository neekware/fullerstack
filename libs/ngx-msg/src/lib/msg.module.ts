import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@fullerstack/ngx-material';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { AlertComponent } from './alert/alert.component';
import { HintComponent } from './hint/hint.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MsgService } from './msg.service';

@NgModule({
  imports: [CommonModule, MaterialModule, I18nModule],
  declarations: [SnackbarComponent, AlertComponent, HintComponent],
  exports: [SnackbarComponent, AlertComponent, HintComponent],
})
export class MsgModule {
  imports: [CommonModule];
  provides: [MsgService];
}
