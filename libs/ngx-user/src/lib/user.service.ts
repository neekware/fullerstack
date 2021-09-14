/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { GqlErrorsHandler, GqlService } from '@fullerstack/ngx-gql';
import { UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LogLevel, LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep as ldDeepClone, merge as ldMergeWith } from 'lodash-es';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultUserConfig, DefaultUserState } from './user.default';
import { UserState } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private nameSpace = 'USER';
  private claimId: string;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<UserState> = DefaultUserState;
  readonly stateSub$: Observable<UserState>;

  constructor(
    readonly config: ConfigService,
    readonly store: StoreService,
    readonly msg: MsgService,
    readonly gql: GqlService,
    readonly gtag: GTagService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly auth: AuthService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ auth: DefaultUserConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.stateSub$ = this.store.select$<UserState>(this.nameSpace);

    this.claimSlice();
    this.initState();
    this.subState();

    this.auth.stateSub$
      .pipe(
        filter((state) => state.isLoggedIn),
        switchMap((state) => this.userSelfQuery$(state.userId)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          this.msg.reset();
          this.i18n.setCurrentLanguage(state?.language);
        },
        error: (err) => {
          this.logger.error(`[${this.nameSpace}] User self query failed ...`, err);
          this.msg.setMsg({ text: err?.message, level: LogLevel.error });
        },
      });

    this.i18n.stateChange$
      .pipe(
        debounceTime(200),
        filter((language) => this.state.id && language !== this.state.language),
        switchMap((language) => {
          this.msg.reset();
          return this.userSelfUpdateMutate$({ id: this.state.id, language });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.msg.setMsg({
            text: _('SUCCESS.USER.LANGUAGE_CHANGE'),
            level: LogLevel.success,
          });
        },
        error: () => {
          this.msg.setMsg({
            text: _('ERROR.USER.LANGUAGE_CHANGE'),
            level: LogLevel.error,
          });
        },
      });
  }

  /**
   * Claim User state:slice
   */
  private claimSlice() {
    if (!this.options?.user?.logState) {
      this.claimId = this.store.claimSlice(this.nameSpace);
    } else {
      this.claimId = this.store.claimSlice(this.nameSpace, this.logger.debug.bind(this.logger));
    }
  }

  /**
   * Initialize User state:slice
   */
  private initState() {
    this.store.setState(this.claimId, DefaultUserState);
  }

  /**
   * Subscribe to User state:slice changes
   */
  private subState() {
    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        this.state = { ...DefaultUserState, ...newState };
      },
    });
  }

  userSelfQuery$(id: string): Observable<UserState> {
    this.msg.reset();
    this.logger.debug(`[${this.nameSpace}] Self query request sent ...`);

    return this.gql.client.request<UserState>(UserSelfQuery, { id }).pipe(
      map((resp) => {
        this.logger.debug(`[${this.nameSpace}] Self query request success ...`);
        return this.store.setState<UserState>(this.claimId, { ...DefaultUserState, ...resp });
      }),
      catchError((err: GqlErrorsHandler) => {
        this.logger.error(`[${this.nameSpace}] Self query request failed ...`, err);
        this.msg.setMsg({ text: err.topError?.message, level: LogLevel.error });
        return of(this.state as UserState);
      })
    );
  }

  userSelfUpdateMutate$(input: UserSelfUpdateInput): Observable<UserState> {
    this.msg.reset();
    this.logger.debug(`[${this.nameSpace}] Self update request sent ...`);

    return this.gql.client.request<UserState>(UserSelfUpdateMutation, { input }).pipe(
      map((resp) => {
        this.logger.debug(`[${this.nameSpace}] Self update request success ...`);
        this.msg.setMsg({ text: _('SUCCESS.USER.UPDATE'), level: LogLevel.success });
        return this.store.setState<UserState>(this.claimId, { ...DefaultUserState, ...resp });
      }),
      catchError((err: GqlErrorsHandler) => {
        this.logger.error(`[${this.nameSpace}] Self update request failed ...`, err);
        this.msg.setMsg({
          text: err.topError?.message || _('ERROR.USER.UPDATE'),
          level: LogLevel.error,
        });
        return of(this.state as UserState);
      })
    );
  }
}
