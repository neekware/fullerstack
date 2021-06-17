import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { CachifyFetchPolicy, makeCachifyContext } from '@fullerstack/ngx-cachify';
import { GqlService, createGqlBody } from '@fullerstack/ngx-gql';
import { UserQuery, UserSelfQuery, UserSelfUpdateMutation } from '@fullerstack/ngx-gql/operations';
import { User, UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import * as objectHash from 'object-hash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DefaultUser } from './user.default';

@Injectable({ providedIn: 'root' })
export class UserService {
  private destroy$ = new Subject<boolean>();
  profileChanged$ = new BehaviorSubject<User>(DefaultUser);
  profile: User = DefaultUser;
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
        switchMap(() => this.userSelfQuery(this.auth.userId, CachifyFetchPolicy.NetworkFirst)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.profile = user as User;
          this.profileChanged$.next(this.profile);
        },
      });
  }

  userSelfQuery(id: string, cachePolicy?: CachifyFetchPolicy): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(
        UserSelfQuery,
        { id },
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
        })
      );
  }

  userQuery(id: string): Observable<User> {
    this.isLoading = true;
    this.msg.reset();
    return this.gql.client
      .request<User>(UserQuery, { id })
      .pipe(tap(() => (this.isLoading = false)));
  }
}
