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
import {
  CookiesDecorator,
  LocaleDecorator,
  RequestDecorator,
  ResponseDecorator,
} from './auth.decorator';
import { AuthGuardAnonymousGql } from './auth.guard.anonymous';
import { AuthGuardGql } from './auth.guard.gql';
import {
  AuthStatusDto,
  AuthTokenDto,
  ChangePasswordInput,
  ChangePasswordRequestInput,
  UserCreateInput,
  UserCredentialsInput,
  UserVerifyInput,
} from './auth.model';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';
import { buildPasswordResetLink, buildVerifyUserLink } from './auth.util';

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
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCreateInput
  ) {
    const user = await this.auth.createUser(data);
    const token = this.security.issueToken(user, request, response);
    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexVerifyLink: buildVerifyUserLink(user.id, this.security.siteSecret, this.options.siteUrl),
      RegexCompanyName: this.options.siteName,
      RegexSupportEmail: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject('account-creation', locale, emailContext);

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: user.email,
      subject: emailSubjectBody.subject,
      html: emailSubjectBody.html,
    });

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
    @Args('input') data: ChangePasswordInput
  ) {
    const user = await this.security.changePassword(
      request.user as User,
      data.oldPassword,
      data.newPassword,
      data.resetOtherSessions
    );

    const token = this.security.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthStatusDto)
  async authPasswordResetRequest(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: ChangePasswordRequestInput
  ) {
    const user = await this.security.validateUserByEmail(data.email);
    if (!user) {
      return { ok: false, message: ApiError.Error.Auth.InvalidOrInactiveUser };
    }

    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexVerifyLink: buildPasswordResetLink(
        user.id,
        this.security.siteSecret,
        this.options.siteUrl
      ),
      RegexCompanyName: this.options.siteName,
      RegexSupportEmail: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject('password-reset-request', locale, emailContext);

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: user.email,
      subject: emailSubjectBody.subject,
      html: emailSubjectBody.html,
    });

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

  @Mutation(() => AuthStatusDto)
  async authVerifyUser(
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: UserVerifyInput
  ) {
    const user = await this.security.verifyUser(data.token, data.idb64);
    if (!user) {
      throw new UnauthorizedException(ApiError.Error.Auth.FailedToVerifyUser);
    }
    return { ok: !!user.id };
  }
}
