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
  AuthEmailChangePerformInput,
  AuthEmailChangeRequestInput,
  AuthEmailVerifyAvailabilityInput,
  AuthPasswordChangeInput,
  AuthPasswordChangeRequestInput,
  AuthPasswordPerformResetInput,
  AuthPasswordVerifyInput,
  AuthPasswordVerifyResetRequestInput,
  AuthStatusDto,
  AuthTokenDto,
  AuthUserCredentialsInput,
  AuthUserSignupInput,
  AuthUserVerifyInput,
} from './auth.model';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';
import {
  buildEmailChangeLink,
  buildPasswordResetLink,
  buildUserVerificationLink,
} from './auth.util';

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
  async authUserSignup(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: AuthUserSignupInput
  ) {
    const user = await this.auth.createUser(data);
    const token = this.security.issueToken(user, request, response);
    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexVerifyLink: buildUserVerificationLink(
        user,
        this.security.siteSecret,
        this.options.siteUrl
      ),
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
  async authUserLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: AuthUserCredentialsInput
  ) {
    const user = await this.auth.authenticateUser(data);
    const token = this.security.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authTokenRefresh(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload = this.security.verifyToken<JwtDto>(cookies[AUTH_SESSION_COOKIE_NAME]);
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
  async authUserLogout(@ResponseDecorator() response: HttpResponse) {
    this.security.clearHttpCookie(response);
    return { ok: true };
  }

  @Mutation(() => AuthStatusDto)
  async authUserVerify(
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthUserVerifyInput
  ) {
    const user = await this.security.verifyUser(data.token);
    if (!user) {
      throw new UnauthorizedException(ApiError.Error.Auth.FailedToVerifyUser);
    }
    return { ok: !!user.id };
  }

  @Mutation(() => AuthStatusDto)
  async authEmailVerifyAvailability(@Args('input') data: AuthEmailVerifyAvailabilityInput) {
    const isAvailable = !(await this.security.isEmailInUse(data.email));
    return { ok: isAvailable };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthStatusDto)
  async authPasswordVerify(
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthPasswordVerifyInput
  ) {
    const user = await this.security.validateUser(request.user.id);
    const isValid = this.security.validatePassword(data.password, user.password);
    return { ok: isValid };
  }

  @Mutation(() => AuthStatusDto)
  async authPasswordResetRequest(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: AuthPasswordChangeRequestInput
  ) {
    const user = await this.security.validateUserByEmail(data.email);
    if (!user) {
      return { ok: false, message: ApiError.Error.Auth.InvalidOrInactiveUser };
    }

    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexPasswordResetLink: buildPasswordResetLink(
        user,
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

  @Mutation(() => AuthStatusDto)
  async authPasswordVerifyResetRequest(
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthPasswordVerifyResetRequestInput
  ) {
    const valid = await this.security.verifyPasswordResetLink(data.token);
    if (!valid) {
      return { ok: false, message: ApiError.Error.Auth.InvalidPasswordResetLink };
    }

    return { ok: true };
  }

  @Mutation(() => AuthStatusDto)
  async authPasswordPerformReset(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthPasswordPerformResetInput
  ) {
    const user = await this.auth.performPasswordReset(
      data.token,
      data.password,
      data.resetOtherSessions
    );

    if (!user) {
      return { ok: false, message: ApiError.Error.Auth.InvalidOrInactiveUser };
    }

    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexCompanyName: this.options.siteName,
      RegexSupportEmail: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject(
      'password-reset-confirmation',
      locale,
      emailContext
    );

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: user.email,
      subject: emailSubjectBody.subject,
      html: emailSubjectBody.html,
    });

    return { ok: true };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthStatusDto)
  async authPasswordChange(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthPasswordChangeInput
  ) {
    const user = await this.auth.changePassword(
      request.user as User,
      data.oldPassword,
      data.newPassword,
      data.resetOtherSessions
    );

    if (!user) {
      return { ok: false, message: ApiError.Error.Auth.InvalidOrInactiveUser };
    }

    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexCompanyName: this.options.siteName,
      RegexSupportEmail: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject(
      'password-reset-confirmation',
      locale,
      emailContext
    );

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: user.email,
      subject: emailSubjectBody.subject,
      html: emailSubjectBody.html,
    });

    return { ok: true };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthStatusDto)
  async authEmailChangeRequest(
    @LocaleDecorator() language: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: AuthEmailChangeRequestInput
  ) {
    const user = request.user;
    const locale = user.language || this.i18n.getPreferredLocale(language);

    const emailContext: RenderContext = {
      RegexName: `${user.firstName} ${user.lastName}`,
      RegexSiteUrl: this.options.siteUrl,
      RegexEmailChangeLink: buildEmailChangeLink(
        user,
        data.email,
        this.security.siteSecret,
        this.options.siteUrl
      ),
      RegexCompanyName: this.options.siteName,
      RegexSupportEmail: this.options.siteSupportEmail,
    };

    const emailSubjectBody = getEmailBodySubject('email-change-request', locale, emailContext);

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: user.email,
      subject: emailSubjectBody.subject,
      html: emailSubjectBody.html,
    });

    return { ok: true };
  }

  @Mutation(() => AuthStatusDto)
  async authEmailChangePerform(
    @RequestDecorator() request: HttpRequest,
    @Args('input') data: AuthEmailChangePerformInput
  ) {
    const user = await this.auth.performEmailChange(data.token);
    if (!user) {
      return { ok: false, message: ApiError.Error.Auth.InvalidEmailChangeLink };
    }

    return { ok: true };
  }
}
