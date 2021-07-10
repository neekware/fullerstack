/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError, JwtDto } from '@fullerstack/agx-dto';
import {
  ApplicationConfig,
  HttpRequest,
  HttpResponse,
  RenderContext,
  getEmailBodySubject,
} from '@fullerstack/nsx-common';
import { I18nService } from '@fullerstack/nsx-i18n';
import { MailerService } from '@fullerstack/nsx-mailer';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { DeepReadonly } from 'ts-essentials';

import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { CookiesDecorator, RequestDecorator, ResponseDecorator } from './auth.decorator';
import { AuthGuardAnonymousGql } from './auth.guard.anonymous';
import { AuthGuardGql } from './auth.guard.gql';
import {
  AuthStatusDto,
  AuthTokenDto,
  ChangePasswordInput,
  ChangePasswordRequestInput,
  UserCreateInput,
  UserCredentialsInput,
} from './auth.model';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

@Resolver(() => AuthTokenDto)
export class AuthResolver {
  readonly options: DeepReadonly<ApplicationConfig>;

  constructor(
    readonly config: ConfigService,
    readonly auth: AuthService,
    readonly security: SecurityService,
    readonly i18n: I18nService,
    readonly mailer: MailerService
  ) {
    this.options = this.config.get<ApplicationConfig>('appConfig');
  }

  @Mutation(() => AuthTokenDto)
  async authRegister(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCreateInput
  ) {
    const user = await this.auth.createUser(data);
    const token = this.security.issueToken(user, request, response);

    const emailContext: RenderContext = {
      name_v: `${user.firstName} ${user.lastName}`,
      company_name_v: this.options.siteName,
      site_url: this.options.siteUrl,
      verify_link_v: `${this.options.siteUrl}/verify/${user.email}`,
      site_email_v: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject('welcome', 'en', emailContext);

    this.mailer.sendPostmark({
      To: user.email,
      From: this.options.siteSupportEmail,
      ...emailSubjectBody,
    });
    // .then(() => console.log(`User ${user.id} updated`));

    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCredentialsInput
  ) {
    const user = await this.auth.authenticateUser(data);
    const token = this.security.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authRefreshToken(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload: JwtDto = this.security.verifyToken(cookies[AUTH_SESSION_COOKIE_NAME]);
    if (!payload) {
      throw new UnauthorizedException(ApiError.Error.Auth.Unauthorized);
    }

    const user = await this.security.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidOrRemotelyTerminatedSession);
    }

    const token = this.security.issueToken(user, request, response);
    return { ok: true, token };
  }

  @UseGuards(AuthGuardAnonymousGql)
  @Mutation(() => AuthStatusDto)
  async authLogout(@ResponseDecorator() response: HttpResponse) {
    this.security.clearHttpCookie(response);
    return { ok: true };
  }

  @Mutation(() => AuthStatusDto)
  async isEmailAvailable(@Args('email', { type: () => String }) email: string) {
    const isAvailable = !(await this.auth.isEmailInUse(email));
    return { ok: isAvailable };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthTokenDto)
  async authChangePassword(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload: ChangePasswordInput
  ) {
    const user = await this.security.changePassword(
      request.user as User,
      payload.oldPassword,
      payload.newPassword,
      payload.resetOtherSessions
    );

    const token = this.security.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthStatusDto)
  async authResetPasswordRequest(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload?: ChangePasswordRequestInput
  ) {
    await this.security.validateUserByEmail(payload.email);

    // send email out

    return { ok: true };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthTokenDto)
  async authResetPassword(
    @RequestDecorator() request: HttpRequest
    // @ResponseDecorator() response: HttpResponse,
    // @Args('id') payload?: string
  ) {
    // verify one-time hash key

    await this.security.resetPassword(request.user as User);

    return { ok: true };
  }
}
