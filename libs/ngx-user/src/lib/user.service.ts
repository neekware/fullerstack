import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { CachifyFetchPolicy, makeCachifyContext } from '@fullerstack/ngx-cachify';
import { GqlResponseBody, GqlService, makeGqlBody } from '@fullerstack/ngx-gql';
import { UserQuery, UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { User, UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { ExecutionResult } from 'graphql';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DefaultUser } from './user.default';

export interface FetchResult<
  TData = {
    [key: string]: any;
  },
  C = Record<string, any>,
  E = Record<string, any>
> extends ExecutionResult {
  data?: TData | null;
  extensions?: E;
  context?: C;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  profileChanged$ = new BehaviorSubject<User>(DefaultUser);
  profile: User = DefaultUser;
  private destroy$ = new Subject<boolean>();
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
        switchMap(() => this.userSelf()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
        },
      });
  }

  userSelf(): Observable<unknown> {
    this.isLoading = true;
    this.msg.reset();
    return this.http
      .post(this.gql.options.gql.endpoint, makeGqlBody(UserSelfQuery), {
        context: makeCachifyContext({
          key: 'UserSelfQuery',
          policy: CachifyFetchPolicy.CacheAndNetwork,
          ttl: 100,
        }),
      })
      .pipe(
        map((resp: GqlResponseBody) => resp.data.userSelf),
        tap(() => (this.isLoading = false))
      );

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
  }

  userSelfUpdate(input: UserSelfUpdateInput): Observable<unknown> {
    this.isLoading = true;
    this.msg.reset();
    return this.http
      .post(this.auth.options.gql.endpoint, makeGqlBody(UserSelfUpdateMutation, { input }), {
        context: makeCachifyContext({
          key: 'UserSelfUpdateMutation',
          policy: CachifyFetchPolicy.CacheAndNetwork,
          ttl: 100,
        }),
      })
      .pipe(
        catchError((error) => {
          if (error.error instanceof ErrorEvent) {
            console.log(`Error: ${error.error.message}`);
          } else {
            console.log(`Error: ${error.message}`);
          }
          return of([]);
        }),
        map((resp: GqlResponseBody) => resp.data.userSelfUpdate),
        tap((user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
          this.isLoading = false;
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

  user(id: string): Observable<unknown> {
    this.isLoading = true;
    this.msg.reset();

    return this.http.post(this.auth.options.gql.endpoint, makeGqlBody(UserQuery, { id })).pipe(
      map((resp: GqlResponseBody) => resp.data.user),
      tap(() => (this.isLoading = false))
    );

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
}
