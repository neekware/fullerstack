/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { Base64, HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export function convertExecutionContextToGqlContext(context: ExecutionContext) {
  return GqlExecutionContext.create(context).getContext();
}

export function getRequestFromContext(context: ExecutionContext): HttpRequest {
  return convertExecutionContextToGqlContext(context).request as HttpRequest;
}

export function getResponseFromContext(context: ExecutionContext): HttpResponse {
  return convertExecutionContextToGqlContext(context).response as HttpResponse;
}

export function getCookiesFromContext(context: ExecutionContext): string[] {
  const request = getRequestFromContext(context);
  return tryGet<string[]>(() => request?.cookies, []);
}

export function getCookieFromContext(context: ExecutionContext, name: string): string {
  const cookies = getCookiesFromContext(context);
  return tryGet<string>(() => cookies[name], undefined);
}

export function getJwtTokenFromAuthorizationHeader(request: HttpRequest): string {
  const authorization = tryGet(() => request.headers.authorization, '');
  return authorization.replace(JWT_BEARER_REALM, '').trim();
}

export function getLocalesFromContext(context: ExecutionContext): string[] {
  const request = getRequestFromContext(context);
  const user = request?.user;
  if (user?.language) {
    return [user.language];
  }
  const acceptLanguage = request?.headers['accept-language'];
  const langs = acceptLanguage?.match(/[a-zA-Z-]{2,10}/g) || [];
  return langs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeURITokenComponent(payload: any, secret: string, expiry = '1d'): string {
  const singedToken = jwt.sign(payload, secret, { expiresIn: expiry });
  const b64Encoded = Base64.encode(singedToken);
  const urlEncoded = encodeURIComponent(b64Encoded);
  return urlEncoded;
}

export function decodeURITokenComponent<T>(urlEncodedToken: string, secret: string): T {
  const b64Encoded = decodeURIComponent(urlEncodedToken);
  const singedToken = Base64.decode(b64Encoded);
  try {
    return jwt.verify(singedToken, secret) as T;
  } catch (err) {
    return undefined;
  }
}

/*
 * Generate a safe URL, to verify a new user
 * @param {user} user object
 * @param {secret} site secret
 * @param {baseUrl} base url of the site
 * @returns valid URL
 */
export function buildUserVerificationLink(user: User, secret: string, baseUrl: string): string {
  const encodedToken = encodeURITokenComponent({ userId: user.id }, secret);
  return `${baseUrl}/auth/user/verify/${encodedToken}`;
}

/*
 * Generate a safe URL, to request a password reset
 * @param {user} user object
 * @param {secret} site secret
 * @param {baseUrl} base url of the site
 * @returns valid URL
 */
export function buildPasswordResetLink(user: User, secret: string, baseUrl: string): string {
  const encodedToken = encodeURITokenComponent(
    { userId: user.id, lastLoginAt: user.lastLoginAt },
    secret
  );
  return `${baseUrl}/auth/password/reset/${encodedToken}`;
}

/*
 * Generate a safe URL, to request an email change
 * @param {user} user object
 * @param {email} new email
 * @param {secret} site secret
 * @param {baseUrl] base url of the site
 * @returns valid URL
 */
export function buildEmailChangeLink(
  user: User,
  newEmail: string,
  secret: string,
  baseUrl: string
): string {
  const encodedToken = encodeURITokenComponent({ currentEmail: user.email, newEmail }, secret);
  return `${baseUrl}/auth/email/change/${encodedToken}`;
}
