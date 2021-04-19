import { tryGet } from '@fullerstack/agx-util';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function convertExecutionContextToGqlContext(context: ExecutionContext) {
  return GqlExecutionContext.create(context).getContext();
}

export function getRequestFromContext(context: ExecutionContext): HttpRequest {
  return convertExecutionContextToGqlContext(context).request as HttpRequest;
}

export function getResponseFromContext(
  context: ExecutionContext
): HttpResponse {
  return convertExecutionContextToGqlContext(context).response as HttpResponse;
}

export function getCookiesFromContext(context: ExecutionContext): string[] {
  const request = getRequestFromContext(context);
  return tryGet<string[]>(() => request?.cookies, []);
}

export function getJwtTokenFromAuthorizationHeader(
  request: HttpRequest
): string {
  const authorization = tryGet(() => request.headers.authorization);
  return authorization.replace('Bearer ', '');
}
