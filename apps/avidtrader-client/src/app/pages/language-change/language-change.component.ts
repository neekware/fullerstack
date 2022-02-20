/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ProgressService, ValidationService } from '@fullerstack/ngx-shared';
import { UserService } from '@fullerstack/ngx-user';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.scss'],
})
export class LanguageChangeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.SETTINGS');
  subtitle = _('COMMON.LANGUAGE_CHANGE');
  icon = 'translate';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly user: UserService,
    readonly progress: ProgressService
  ) {
    this.user.msg.reset();
  }

  ngOnInit() {
    this.buildForm();
    this.i18n.stateChange$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
      next: (language) => {
        this.form.patchValue({ language });
        this.form.markAsPristine();
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      language: [this.i18n.currentLanguage || this.i18n.defaultLanguage, [Validators.required]],
    });
  }

  onSelect() {
    if (!this.form.pristine) {
      this.i18n.setCurrentLanguage(this.form?.value.language);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
