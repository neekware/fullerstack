import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { MsgService } from './msg.service';

@NgModule({
  imports: [CommonModule, MaterialModule, I18nModule],
})
export class MsgModule {
  imports: [CommonModule];
  provides: [MsgService];
}
