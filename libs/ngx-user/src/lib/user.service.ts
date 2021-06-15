import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { CachifyFetchPolicy, makeCachifyContext } from '@fullerstack/ngx-cachify';
import { GqlService, createGqlBody } from '@fullerstack/ngx-gql';
import { UserQuery, UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { User, UserSelfUpdateInput, userSelf, userSelfUpdate } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import * as objectHash from 'object-hash';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

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
        switchMap(() => this.userSelf(CachifyFetchPolicy.NetworkFirst)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
        },
      });
  }

  userSelf(cachePolicy?: CachifyFetchPolicy): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(
        UserSelfQuery,
        {},
        {
          context: makeCachifyContext({
            key: objectHash(createGqlBody(UserSelfQuery)),
            policy: cachePolicy,
            ttl: 60,
          }),
        }
      )
      .pipe(tap(() => (this.isLoading = false)));
  }

  // this.isLoading = true;
  // this.msg.reset();
  // return this.gql
  //   .query<userSelf>({
  //     query: UserSelfQuery,
  //   })
  //   .pipe(
  //     map(({ data }) => data?.userSelf),
  //     tap(() => (this.isLoading = false)),
  //     catchError((error) => {
  //       this.isLoading = false;
  //       this.gtag.trackEvent('UserService:[userSelf]', {
  //         event_category: 'user',
  //         event_label: error.message,
  //       });
  //       this.logger.error(error);
  //       this.msg.setMsg(UserMessageMap.error.server);
  //       return of(null);
  //     })
  //   );

  userSelfUpdate(input: UserSelfUpdateInput): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(UserSelfUpdateMutation, { input })
      .pipe(
        tap((user) => {
          this.profile = user;
          this.profileChanged$.next(this.profile);
          this.isLoading = false;
          this.msg.successSnackBar(UserMessageMap.success.update.text, { duration: 4000 });
        })
      );
  }

  // userSelfUpdate(input: UserSelfUpdateInput): Observable<unknown> {
  //   this.isLoading = true;
  //   this.msg.reset();
  //   return this.gql
  //     .mutate<userSelfUpdate>({
  //       mutation: UserSelfUpdateMutation,
  //       variables: { input },
  //     })
  //     .pipe(
  //       map(({ data }) => data.userSelfUpdate),
  //       tap((user) => {
  //         this.profile = user as User;
  //         this.profileChanged$.next(this.profile);
  //         this.isLoading = false;
  //       }),
  //       catchError((error) => {
  //         this.isLoading = false;
  //         this.gtag.trackEvent('UserService:[userSelfUpdate]', {
  //           event_category: 'user',
  //           event_label: error.message,
  //         });
  //         this.logger.error(error);
  //         this.msg.setMsg(UserMessageMap.error.server);
  //         return of(null);
  //       })
  //     );
  // }

  user(id: string): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(UserQuery, { id })
      .pipe(tap(() => (this.isLoading = false)));
  }

  // return this.gql
  //   .query<user>({
  //     query: UserQuery,
  //     variables: { id },
  //   })
  //   .pipe(
  //     map(({ data }) => data.user),
  //     tap(() => (this.isLoading = false)),
  //     catchError((error) => {
  //       this.isLoading = false;
  //       this.gtag.trackEvent('UserService:[user]', {
  //         event_category: 'user',
  //         event_label: error.message,
  //       });
  //       this.logger.error(error);
  //       this.msg.setMsg(UserMessageMap.error.server);
  //       return of(null);
  //     })
  //   );
}
