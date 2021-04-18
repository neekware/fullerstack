import { tryGet } from '@fullerstack/agx-utils';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CookiesDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as HttpRequest;
    return tryGet(() => request.cookies[data as any], request.cookies);
  }
);

export const RequestDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as HttpRequest;
  }
);

export const ResponseDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().res as HttpResponse;
  }
);
