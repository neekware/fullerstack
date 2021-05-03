/* eslint-disable */
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { LoggerService, LogLevels } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { _ } from '@fullerstack/ngx-i18n';
import { GqlService, gqlMgr } from '@fullerstack/ngx-gql';
import * as schema from '@fullerstack/ngx-gql/schema';

import {
  AuthLoginCredentials,
  AuthRegisterCredentials,
} from './auth-state.model';
import * as actions from './auth-state.action';

const JwtLoginMutationNode = gqlMgr.getOperation('JwtLogin');
const JwtRegisterMutationNode = gqlMgr.getOperation('JwtRegister');
const JwtRefreshMutationNode = gqlMgr.getOperation('JwtRefresh');

@Injectable()
export class AuthEffect {
  constructor(
    private msg: MsgService,
    private logger: LoggerService,
    private gql: GqlService,
    private store: Store
  ) {}

  private loginHandleError(
    msg: string,
    level: LogLevels,
    credentials?: AuthLoginCredentials
  ): Observable<any> {
    this.msg.setMsg({
      text: msg || _('AUTH.ERROR.LOGIN'),
      detail: `Login Failed ${JSON.stringify(credentials)}, (${msg})`,
      code: 'AUTH.ERROR.LOGIN',
      level: LogLevels.error,
    });
    return this.store.dispatch(new actions.LoginFailure());
  }

  loginRequest(credentials: AuthLoginCredentials): Observable<any> {
    this.logger.info('Login request sent ...');

    return from(
      this.gql.client.mutate<schema.JwtLoginMutation>({
        mutation: JwtLoginMutationNode,
        variables: credentials,
      })
    ).pipe(
      map(({ data }) => data.jwtLogin),
      map(
        (resp) => {
          if (resp.ok) {
            this.msg.setMsg({
              text: _('AUTH.SUCCESS.LOGIN'),
              level: LogLevels.debug,
            });
            return this.store.dispatch(new actions.LoginSuccess(resp.token));
          } else {
            return this.loginHandleError(resp.msg, LogLevels.warn, credentials);
          }
        },
        (error) => {
          return this.loginHandleError(
            error.message,
            LogLevels.warn,
            credentials
          );
        }
      ),
      catchError((error, caught) => {
        return this.loginHandleError(
          error.message,
          LogLevels.warn,
          credentials
        );
      })
    );
  }

  private registerHandleError(
    msg: string,
    level: LogLevels,
    credentials?: AuthRegisterCredentials
  ): Observable<any> {
    this.msg.setMsg({
      text: msg || _('AUTH.ERROR.REGISTER'),
      detail: `Registration Failed ${JSON.stringify(credentials)}, (${msg})`,
      code: 'AUTH.ERROR.REGISTER',
      level: LogLevels.error,
    });
    return this.store.dispatch(new actions.RegisterFailure());
  }

  registerRequest(credentials: AuthRegisterCredentials): Observable<any> {
    this.logger.debug('Register request sent ...');
    return from(
      this.gql.client.mutate<schema.JwtRegisterMutation>({
        mutation: JwtRegisterMutationNode,
        variables: credentials,
      })
    ).pipe(
      map(({ data }) => data.jwtRegister),
      map(
        (resp) => {
          if (resp.ok) {
            this.msg.setMsg({
              text: _('AUTH.SUCCESS.REGISTER'),
              level: LogLevels.debug,
            });
            return this.store.dispatch(new actions.RegisterSuccess(resp.token));
          } else {
            return this.registerHandleError(
              resp.msg,
              LogLevels.warn,
              credentials
            );
          }
        },
        (error) => {
          return this.registerHandleError(
            error.message,
            LogLevels.warn,
            credentials
          );
        }
      ),
      catchError((error, caught) => {
        return this.registerHandleError(
          error.message,
          LogLevels.warn,
          credentials
        );
      })
    );
  }

  private refreshHandleError(
    msg: string,
    level: LogLevels,
    token?: string
  ): Observable<any> {
    this.msg.setMsg({
      text: msg || _('AUTH.ERROR.REFRESH'),
      detail: `Registration Failed ${token}, (${msg})`,
      code: 'AUTH.ERROR.REFRESH',
      level: LogLevels.error,
    });
    return this.store.dispatch(new actions.TokenRefreshFailure());
  }

  refreshRequest(token: string): Observable<any> {
    this.logger.debug('Token refresh request sent ...');
    return from(
      this.gql.client.mutate<schema.JwtRefreshMutation>({
        mutation: JwtRefreshMutationNode,
        variables: { token: token },
      })
    ).pipe(
      map(({ data }) => data.jwtRefresh),
      map(
        (resp) => {
          if (resp.ok) {
            this.msg.setMsg({
              text: _('AUTH.SUCCESS.REFRESH'),
              level: LogLevels.debug,
            });
            return this.store.dispatch(
              new actions.TokenRefreshSuccess(resp.token)
            );
          } else {
            return this.refreshHandleError(resp.msg, LogLevels.warn, token);
          }
        },
        (error) => {
          return this.refreshHandleError(error.message, LogLevels.warn, token);
        }
      ),
      catchError((error, caught) => {
        return this.refreshHandleError(error.message, LogLevels.warn, token);
      })
    );
  }
}
