import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { GqlService } from '@fullerstack/ngx-gql';
import * as gqlOperations from '@fullerstack/ngx-gql/operations';
import * as gqlSchema from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { Observable, Subject, from, of } from 'rxjs';
import { catchError, map, take, takeUntil } from 'rxjs/operators';

import { UserMessageMap } from './user.default';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  profile: gqlSchema.User;
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly msg: MsgService,
    readonly gql: GqlService,
    readonly gtag: GTagService,
    readonly logger: LoggerService,
    readonly auth: AuthService
  ) {
    this.auth.authChanged$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (state.isLoggedIn) {
          this.userSelf()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (user) => {
                this.profile = user as gqlSchema.User;
              },
            });
        }
      },
    });
  }

  userSelf(): Observable<unknown> {
    this.msg.reset();
    return from(
      this.gql.client.query<gqlSchema.userSelf>({
        query: gqlOperations.UserSelfQuery,
      })
    ).pipe(
      take(1),
      map(({ data }) => data?.userSelf),
      catchError((error) => {
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

  userSelfUpdate(input: gqlSchema.UserSelfUpdateInput): Observable<unknown> {
    this.msg.reset();
    return from(
      this.gql.client.query<gqlSchema.userSelfUpdate>({
        query: gqlOperations.UserSelfUpdateMutation,
        variables: {},
      })
    ).pipe(
      take(1),
      map(({ data }) => data.userSelfUpdate),
      catchError((error) => {
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
    this.msg.reset();
    return from(
      this.gql.client.query<gqlSchema.user>({
        query: gqlOperations.UserQuery,
        variables: { id },
      })
    ).pipe(
      take(1),
      map(({ data }) => data.user),
      catchError((error) => {
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
