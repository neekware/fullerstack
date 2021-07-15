/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { interpolate } from '@fullerstack/ngx-cachify';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { GqlErrorsHandler, GqlService } from '@fullerstack/ngx-gql';
import { UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreService } from '@fullerstack/ngx-store';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
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
    this.options = ldNestedMerge({ auth: DefaultUserConfig }, this.config.options);

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
          if (state?.language?.length && state?.language !== this.i18n.currentLanguage) {
            this.i18n.setCurrentLanguage(state.language);
          }
        },
      });
  }

  /**
   * Claim User state:slice
   */
  private claimSlice() {
    const logger = this.options?.user?.logState ? this.logger.debug.bind(this.logger) : undefined;
    this.claimId = this.store.claimSlice(this.nameSpace, logger);
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

  getUserCacheKey(id: string): string {
    return interpolate('user/${id}', { id });
  }

  userSelfQuery$(id: string): Observable<UserState> {
    this.store.setState(this.claimId, { ...DefaultUserState, isLoading: true });
    this.logger.debug(`[${this.nameSpace}] Self query request sent ...`);

    return this.gql.client
      .request<UserState>(UserSelfQuery, { id })
      .pipe(
        map((resp) => {
          this.logger.debug(`[${this.nameSpace}] Self query request success ...`);
          return this.store.setState<UserState>(this.claimId, { ...DefaultUserState, ...resp });
        }),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] Self query request failed ...`, err);
          return of(
            this.store.setState<UserState>(this.claimId, {
              ...DefaultUserState,
              hasError: true,
              message: err.topError?.message,
            })
          );
        })
      );
  }

  userSelfUpdateMutate$(input: UserSelfUpdateInput): Observable<UserState> {
    this.store.setState(this.claimId, { ...this.state, isLoading: true });
    this.logger.debug(`[${this.nameSpace}] Self update request sent ...`);

    return this.gql.client
      .request<UserState>(UserSelfUpdateMutation, { input })
      .pipe(
        map((resp) => {
          this.logger.debug(`[${this.nameSpace}] Self update request success ...`);
          return this.store.setState<UserState>(this.claimId, { ...DefaultUserState, ...resp });
        }),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] Self update request failed ...`, err);
          return of(
            this.store.setState<UserState>(this.claimId, {
              ...this.state,
              isLoading: false,
              hasError: true,
              message: err.topError?.message,
            })
          );
        })
      );
  }

  // userQuery(id: string): Observable<User> {
  //   this.isLoading = true;
  //   this.msg.reset();
  //   return this.gql.client
  //     .request<User>(UserQuery, { id })
  //     .pipe(tap(() => (this.isLoading = false)));
  // }
}
