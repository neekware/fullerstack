import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { AlertComponent } from './component/alert';
import { CardComponent } from './component/card/card.component';
import { ConfirmationDialogComponent } from './component/confirm/confirm.component';
import { HintComponent } from './component/hint/hint.component';
import { RippleComponent } from './component/ripple/ripple.component';
import { SnackbarComponent } from './component/snackbar/snackbar.component';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, I18nModule],
  declarations: [
    HintComponent,
    AlertComponent,
    CardComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    SnackbarComponent,
  ],
  exports: [
    HintComponent,
    AlertComponent,
    CardComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    SnackbarComponent,
  ],
  providers: [],
})
export class SharedModule {}
