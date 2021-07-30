/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CfgService } from '@nwx/cfg';
import { GtagService } from '@nwx/gtag';
import { _ } from '@nwx/i18n';
import { LogLevels, LogService } from '@nwx/logger';
import { AuthService } from 'corelibs/auth';
import { GqlService, operations, schema } from 'corelibs/gql';
import { LayoutService } from 'corelibs/layout';
import { get } from 'lodash';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ConfirmationDialogService, ValidationService } from 'sharedlibs/common';
import { MessageMap, MsgService } from 'sharedlibs/common';

export const ContactMessageMap: MessageMap = {
  success: {
    contact: {
      text: _('SUCCESS.CONTACT.MESSAGE.SENT'),
      code: 'SUCCESS.CONTACT.MESSAGE.SENT',
      level: LogLevels.info,
      console: true,
    },
  },
  error: {
    contact: {
      text: _('ERROR.CONTACT.MESSAGE.SENT'),
      code: 'ERROR.CONTACT.MESSAGE.SENT',
      level: LogLevels.warn,
      console: true,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevels.error,
      console: true,
    },
  },
};

@Component({
  selector: 'fullerstack-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [ConfirmationDialogService],
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  title = _('COMMON.CONTACT_US');
  icon = 'send';
  isLoading = false;
  submitSuccess = false;

  constructor(
    public cfg: CfgService,
    public log: LogService,
    public gql: GqlService,
    public gtag: GtagService,
    public msg: MsgService,
    public auth: AuthService,
    public layout: LayoutService,
    public formBuilder: FormBuilder,
    public validation: ValidationService,
    public confirm: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, this.validation.validateEmail]],
      subject: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
    if (this.auth.state.isLoggedIn) {
      this.form?.controls?.name.clearValidators();
      this.form?.controls?.email.clearValidators();
      const user = get(this.auth.state, 'userProfile');
      this.form.patchValue({
        name: get(user, 'fullName', ''),
        email: get(user, 'email', ''),
      });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.form?.disabled && this.form?.dirty && this.auth.state.isLoggedIn) {
      const title = _('COMMON.LEAVE_PAGE');
      const info = _('WARN.DISCARD_CHANGES_ACTION');
      return this.confirm.confirmation(title, info);
    }
    return true;
  }

  submit() {
    this.msg.reset();
    this.isLoading = true;
    this.sendMessage(this.form.value).subscribe((sent) => {
      this.msg.processMsg();
      this.isLoading = false;
      this.submitSuccess = true;
      this.form.markAsPristine();
    });
  }

  sendMessage(contact: any): Observable<any> {
    return this.gql.client
      .mutate<schema.ContactUs>({
        mutation: operations.ContactUsMutation,
        variables: contact,
      })
      .pipe(
        take(1),
        map(({ data }) => data.contactUs),
        map((resp) => {
          if (resp.ok) {
            this.gtag.trackEvent('contact_us_success', {
              event_category: 'contact',
              event_label: 'contact message success',
            });
            this.msg.setMsg(ContactMessageMap.success.contact);
            return true;
          }
          this.gtag.trackEvent('contact_us_failed', {
            event_category: 'contact',
            event_label: resp.msg,
          });
          this.log.error(resp.msg);
          this.msg.setMsg(ContactMessageMap.error.contact);
          return false;
        }),
        catchError((error, caught$) => {
          this.gtag.trackEvent('contact_us_failed', {
            event_category: 'contact',
            event_label: error.message,
          });
          this.log.error(error);
          this.msg.setMsg(ContactMessageMap.error.server);
          return observableOf(false);
        })
      );
  }
}
