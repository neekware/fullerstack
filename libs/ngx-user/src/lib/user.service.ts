import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { CachifyFetchPolicy, interpolate, makeCachifyContext } from '@fullerstack/ngx-cachify';
import { GqlService, createGqlBody } from '@fullerstack/ngx-gql';
import { UserQuery, UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { User, UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import * as objectHash from 'object-hash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DefaultUser, UserMessageMap } from './user.default';

@Injectable({ providedIn: 'root' })
export class UserService {
  private destroy$ = new Subject<boolean>();
  profileChanged$ = new BehaviorSubject<User>(DefaultUser);
  profile: User = DefaultUser;
  isLoading = false;

  constructor(
    readonly http: HttpClient,
    readonly msg: MsgService,
    readonly gql: GqlService,
    readonly gtag: GTagService,
    readonly logger: LoggerService,
    readonly auth: AuthService
  ) {
    this.auth.authChanged$
      .pipe(
        filter((state) => state.isLoggedIn),
        switchMap(() => this.userSelfQuery(CachifyFetchPolicy.NetworkFirst)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
        },
      });
  }

  userSelfQuery(cachePolicy?: CachifyFetchPolicy): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(
        UserSelfQuery,
        { id: this.auth.userId },
        {
          context: makeCachifyContext({
            key: objectHash(createGqlBody(UserSelfQuery)),
            policy: cachePolicy,
            ttl: 60,
          }),
        }
      )
      .pipe(
        tap(() => (this.isLoading = false)),
        catchError((error, caught$) => {
          this.isLoading = false;
          this.logger.error(error);
          return caught$;
        })
      );
  }

  userSelfUpdateMutate(input: UserSelfUpdateInput): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(UserSelfUpdateMutation, { input })
      .pipe(
        tap((user) => {
          this.isLoading = false;
          this.profile = user;
          this.profileChanged$.next(this.profile);
        }),
        catchError((error, caught$) => {
          this.isLoading = false;
          this.logger.error(error);
          return caught$;
        })
      );
  }

  userQuery(id: string): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(UserQuery, { id })
      .pipe(
        tap(() => (this.isLoading = false)),
        catchError((error, caught$) => {
          this.isLoading = false;
          this.logger.error(error);
          return caught$;
        })
      );
  }
}
