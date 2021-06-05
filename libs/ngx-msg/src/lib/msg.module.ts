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
