import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { GqlService } from '@fullerstack/ngx-gql';
import { UserQuery, UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import {
  User,
  UserSelfUpdateInput,
  user,
  userSelf,
  userSelfUpdate,
} from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DefaultUser, UserMessageMap } from './user.default';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  profileChanged$ = new BehaviorSubject<User>(DefaultUser);
  profile: User = DefaultUser;
  private destroy$ = new Subject<boolean>();
  isLoading = false;

  constructor(
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
    return this.gql
      .query<userSelf>({
        query: UserSelfQuery,
      })
      .pipe(
        map(({ data }) => data?.userSelf),
        tap(() => (this.isLoading = false)),
        catchError((error) => {
          this.isLoading = false;
          this.gtag.trackEvent('UserService:[userSelf]', {
            event_category: 'user',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(UserMessageMap.error.server);
          return of(null);
        })
      );
  }

  userSelfUpdate(input: UserSelfUpdateInput): Observable<unknown> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql
      .mutate<userSelfUpdate>({
        mutation: UserSelfUpdateMutation,
        variables: { input },
      })
      .pipe(
        map(({ data }) => data.userSelfUpdate),
        tap((user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
          this.isLoading = false;
        }),
        catchError((error) => {
          this.isLoading = false;
          this.gtag.trackEvent('UserService:[userSelfUpdate]', {
            event_category: 'user',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(UserMessageMap.error.server);
          return of(null);
        })
      );
  }

  user(id: string): Observable<unknown> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql
      .query<user>({
        query: UserQuery,
        variables: { id },
      })
      .pipe(
        map(({ data }) => data.user),
        tap(() => (this.isLoading = false)),
        catchError((error) => {
          this.isLoading = false;
          this.gtag.trackEvent('UserService:[user]', {
            event_category: 'user',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(UserMessageMap.error.server);
          return of(null);
        })
      );
  }
}
