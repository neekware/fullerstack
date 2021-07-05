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
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiConstants } from '@fullerstack/agx-dto';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { UserService, UserState } from '@fullerstack/ngx-user';
import { ValidationService } from '@fullerstack/ngx-util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-user-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileFormComponent implements OnInit {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  @Output() form$ = new EventEmitter<FormGroup>();
  @Input() autocomplete = 'off';
  @Input() title = _('COMMON.PROFILE');
  @Input() subtitle = _('COMMON.PROFILE_UPDATE');
  @Input() icon = 'account-plus-outline';
  @Input() firstNameHint: string;
  @Input() lastNameHint: string;
  @Input() emailHint: string;
  formTouched = false;
  onFormTouched = () => (this.formTouched = true);

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly user: UserService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.user.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.buildForm(state);
      },
    });
  }

  private buildForm(state?: UserState) {
    this.form = this.formBuilder.group({
      id: [state?.id || ''],
      firstName: [
        state?.firstName || '',
        [
          Validators.required,
          Validators.minLength(ApiConstants.FIRST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.FIRST_NAME_MAX_LENGTH),
        ],
      ],
      lastName: [
        state?.lastName || '',
        [
          Validators.required,
          Validators.minLength(ApiConstants.LAST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.LAST_NAME_MAX_LENGTH),
        ],
      ],
      email: [{ value: state?.email || '', disabled: true }],
    });
    this.form$.emit(this.form);
  }

  submit() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, firstName, lastName, ...ignore } = this.form.value;
    this.user
      .userSelfUpdateMutate$({ id, firstName, lastName })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
