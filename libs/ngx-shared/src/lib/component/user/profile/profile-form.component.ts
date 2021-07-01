/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionStatus, ApiConstants } from '@fullerstack/agx-dto';
import { User, UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-user-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileFormComponent implements OnChanges {
  form: FormGroup;
  @Output() submit$ = new EventEmitter<UserSelfUpdateInput>();
  @Output() form$ = new EventEmitter<FormGroup>();
  @Input() profile: User;
  @Input() autocomplete = 'off';
  @Input() title = _('COMMON.PROFILE');
  @Input() subtitle = _('COMMON.PROFILE_UPDATE');
  @Input() icon = 'account-plus-outline';
  @Input() firstNameHint: string;
  @Input() lastNameHint: string;
  @Input() emailHint: string;
  @Input() actionStatus: ActionStatus;
  @Input() statusMessage: string;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService
  ) {}

  ngOnChanges() {
    if (this.profile) {
      this.buildForm(this.profile);
    }

    if (this.actionStatus) {
      switch (this.actionStatus) {
        case ActionStatus.success:
          this.statusMessage = 'SUCCESS.USER.UPDATE';
          break;
        case ActionStatus.failure:
          this.statusMessage = 'ERROR.USER.UPDATE';
          break;
      }
    }
  }

  private buildForm(profile: User) {
    this.form = this.formBuilder.group({
      id: [profile.id],
      firstName: [
        profile.firstName,
        [
          Validators.required,
          Validators.minLength(ApiConstants.FIRST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.FIRST_NAME_MAX_LENGTH),
        ],
      ],
      lastName: [
        profile.lastName,
        [
          Validators.required,
          Validators.minLength(ApiConstants.LAST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.LAST_NAME_MAX_LENGTH),
        ],
      ],
      email: [{ value: profile.email, disabled: true }],
    });
    this.form$.emit(this.form);
  }

  submit() {
    this.submit$.emit(this.form.value);
  }

  get showStatus(): boolean {
    return !this.form.valid || (this.form.pristine && !!this.statusMessage);
  }
}
