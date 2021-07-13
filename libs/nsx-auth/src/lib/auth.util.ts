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
import * as crypto from 'crypto-js';

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

export function getLanguagesFromContext(context: ExecutionContext): string[] {
  const request = getRequestFromContext(context);
  const user = request?.user;
  if (user?.language) {
    return [user.language];
  }
  const acceptLanguage = request?.headers['accept-language'];
  const langs = acceptLanguage?.match(/[a-zA-Z-]{2,10}/g) || [];
  return langs;
}

/*
 * Generate a safe URL, to verify a new user
 * @param userId user id
 * @param salt site secret
 * @param baseUrl base url of the site
 * @returns valid URL
 */
export function buildVerifyUserLink(userId: string, salt: string, baseUrl: string): string {
  const securityToken = encodeURIComponent(crypto.MD5(`${userId}${salt}`).toString());
  const b64Id = encodeURIComponent(Base64.encode(userId));
  return `${baseUrl}/auth/user/verify/${securityToken}/${b64Id}`;
}

export function getUserIdFromBase64(idb64: string): string {
  return Base64.decode(idb64);
}

export function verifySecurityToken(token: string, userId: string, salt: string): boolean {
  return token === encodeURIComponent(crypto.MD5(`${userId}${salt}`).toString());
}
