/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionStatus } from '@fullerstack/agx-dto';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { ConfirmationDialogService } from '@fullerstack/ngx-shared';
import { UserService } from '@fullerstack/ngx-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'fullerstack-user-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  providers: [ConfirmationDialogService],
})
export class ProfileUpdateComponent {
  form: FormGroup;
  title = _('COMMON.PROFILE');
  subtitle = _('COMMON.PROFILE_UPDATE');
  icon = 'account-edit-outline';
  actionStatus: ActionStatus;
  actionMessage: string;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly confirm: ConfirmationDialogService
  ) {}

  formSet(form: FormGroup) {
    this.form = form;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form?.dirty && this.auth.state.isLoggedIn) {
      const title = _('COMMON.LEAVE_PAGE');
      const info = _('WARN.DISCARD_CHANGES_ACTION');
      return this.confirm.confirmation(title, info);
    }
    return true;
  }
}
