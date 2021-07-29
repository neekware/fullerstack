/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';

import { AlertComponent } from './component/alert';
import { BlobComponent } from './component/blob/blob.component';
import { CardComponent } from './component/card/card.component';
import { ConfirmationDialogComponent } from './component/confirm/confirm.component';
import { RippleComponent } from './component/ripple/ripple.component';
import { AutocompleteDirective } from './directive/autocomplete/autocomplete.directive';
import { DebounceClickDirective } from './directive/debounce-click/debounce-click.directive';
import { FormErrorDirective } from './directive/form-error/form-error-directive';
import { InputFocusDirective } from './directive/input-focus/input-focus.directive';
import { TmpLetDirective } from './directive/tmp-let/tmp-let.directive';
import { ProgressService } from './service/progress/progress.service';
import { ValidationService } from './service/validation/validation.service';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, I18nModule],
  declarations: [
    AlertComponent,
    CardComponent,
    BlobComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    AutocompleteDirective,
    FormErrorDirective,
    TmpLetDirective,
    DebounceClickDirective,
    InputFocusDirective,
  ],
  exports: [
    AlertComponent,
    CardComponent,
    BlobComponent,
    RippleComponent,
    ConfirmationDialogComponent,
    AutocompleteDirective,
    FormErrorDirective,
    TmpLetDirective,
    DebounceClickDirective,
    InputFocusDirective,
  ],
  providers: [ValidationService, ProgressService],
})
export class SharedModule {}
